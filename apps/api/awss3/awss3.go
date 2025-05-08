package awss3

import (
	"context"
	"fmt"
	"io"
	"net/url"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/credentials/ec2rolecreds"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/capmoo/api/config"
	"github.com/capmoo/api/errorutil"
	logger "github.com/capmoo/api/utils"
	"github.com/joomcode/errorx"
)

type S3 struct {
	Client *s3.Client
	Config *config.Config
}

// NewS3 creates a new S3 client
func NewS3(ctx context.Context, config *config.Config) (*S3, error) {
	cfg := getS3Config(ctx, config)
	s3Client := s3.NewFromConfig(cfg)

	s3Obj := &S3{
		Client: s3Client,
		Config: config,
	}

	return s3Obj, nil
}

func getS3Config(ctx context.Context, config *config.Config) aws.Config {
	var cfg aws.Config
	var err error

	if config.S3AccessKeyId != "" && config.S3SecretAccessKey != "" {
		cfg, err = awsConfig.LoadDefaultConfig(ctx, awsConfig.WithRegion(config.S3Region),
			awsConfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(config.S3AccessKeyId, config.S3SecretAccessKey, "")),
		)
		if err != nil {
			logger.Panic(err.Error())
		}
		return cfg
	}

	appCreds := aws.NewCredentialsCache(ec2rolecreds.New())
	_, err = appCreds.Retrieve(ctx)
	if err == nil {
		cfg, err = awsConfig.LoadDefaultConfig(ctx, awsConfig.WithRegion(config.S3Region), awsConfig.WithCredentialsProvider(appCreds))
	} else {
		cfg, _ = awsConfig.LoadDefaultConfig(ctx, awsConfig.WithRegion(config.S3Region))
		_, err = cfg.Credentials.Retrieve(ctx)
	}

	if err != nil {
		logger.Panic(err.Error())
	}

	return cfg
}

func (s *S3) Upload(ctx context.Context, bucketName string, key string, reader io.Reader, contentType string) error {
	_, err := s.Client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(bucketName),
		Key:         aws.String(key),
		Body:        reader,
		ContentType: aws.String(contentType),
	})

	if err != nil {
		return errorx.IllegalArgument.New("Couldn't upload file to %v/%v. Here's why: %v\n",
			bucketName, key, err)
	}

	return nil
}

func (s *S3) DeleteObjects(ctx context.Context, bucketName string, objectKeys []string) error {
	objectIds := make([]types.ObjectIdentifier, 0)
	for _, key := range objectKeys {
		objectIds = append(objectIds, types.ObjectIdentifier{Key: aws.String(key)})
	}

	_, err := s.Client.DeleteObjects(ctx, &s3.DeleteObjectsInput{
		Bucket: aws.String(bucketName),
		Delete: &types.Delete{Objects: objectIds},
	})

	if err != nil {
		return errorx.IllegalArgument.New("Couldn't delete objects from bucket %v. Here's why: %v\n", bucketName, err)
	}

	return errorutil.WithStack(err)
}

func (s *S3) GetObject(ctx context.Context, bucketName string, key string) (*s3.GetObjectOutput, error) {
	result, err := s.Client.GetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(key),
	})

	if err != nil {
		return nil, errorx.IllegalArgument.New("Couldn't get object %v from bucket %v. Here's why: %v\n",
			key, bucketName, err)
	}

	return result, nil
}

func (s *S3) ListObjectsID(ctx context.Context, bucketName string, folderPath string) ([]string, error) {
	result, err := s.Client.ListObjectsV2(ctx, &s3.ListObjectsV2Input{
		Bucket: aws.String(bucketName),
		Prefix: aws.String(folderPath),
	})

	var contents []types.Object
	if err != nil {
		return nil, errorx.IllegalArgument.New("Couldn't list objects in bucket %v. Here's why: %v\n", bucketName, err)
	} else {
		contents = result.Contents
	}

	keys := make([]string, 0, len(contents))
	for _, content := range contents {
		keys = append(keys, *content.Key)
	}

	return keys, errorutil.WithStack(err)
}

func (s *S3) CopyToFolder(ctx context.Context, bucketName string, filePath string, targetPath string) error {
	escapedFilePath := url.PathEscape(filePath)
	_, err := s.Client.CopyObject(ctx, &s3.CopyObjectInput{
		Bucket:     aws.String(bucketName),
		CopySource: aws.String(fmt.Sprintf("%v/%v", bucketName, escapedFilePath)),
		Key:        aws.String(fmt.Sprintf("%v", targetPath)),
	})

	if err != nil {
		return errorx.IllegalArgument.New("Couldn't copy object from %v:%v to %v:%v. Here's why: %v\n",
			bucketName, filePath, bucketName, targetPath, err)
	}

	return errorutil.WithStack(err)
}

func (s *S3) GetPresignedURL(ctx context.Context, bucketName string, key string, duration time.Duration) (string, error) {
	presignClient := s3.NewPresignClient(s.Client)

	presignedReq, err := presignClient.PresignGetObject(ctx, &s3.GetObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(key),
	}, func(opts *s3.PresignOptions) {
		opts.Expires = duration
	})

	if err != nil {
		return "", err
	}

	return presignedReq.URL, nil
}
