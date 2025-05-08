package upload

import (
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"net/url"
	"regexp"
	"time"

	"github.com/capmoo/api/awss3"
	"github.com/capmoo/api/config"
)

var (
	pattern       = regexp.MustCompile(`https://(.*)\.s3\.(.*)\.amazonaws\.com/(.*)`)
	fileNameRegex = regexp.MustCompile(`[^a-zA-Z0-9._()\p{L}\p{M}\p{N}]`)
)

type S3Config struct {
	Bucket string
	Region string
}

type UploadService struct {
	s3Client *awss3.S3
	s3Config S3Config
}

func New(s3Client *awss3.S3, config *config.Config) *UploadService {
	return &UploadService{
		s3Client: s3Client,
		s3Config: S3Config{Bucket: config.S3BucketName, Region: config.S3Region},
	}
}

func (u *UploadService) UploadFile(ctx context.Context, fileData io.Reader, filePath, contentType string) (string, error) {
	safeFileName := u.SafeFileName(filePath)
	uniqueFileName := u.appendTimestampToFileName(safeFileName)
	escapedPath := url.PathEscape(uniqueFileName)

	err := u.s3Client.Upload(ctx, u.s3Config.Bucket, escapedPath, fileData, contentType)
	if err != nil {
		return "", fmt.Errorf("failed to upload file to S3: %w", err)
	}

	return uniqueFileName, nil
}

func (u *UploadService) appendTimestampToFileName(fileName string) string {
	timestamp := time.Now().Format("20060102_150405") // e.g., 20250508_113000

	// Split into name and extension
	ext := ""
	base := fileName
	if dot := regexp.MustCompile(`\.[^./\\]+$`).FindStringIndex(fileName); dot != nil {
		base = fileName[:dot[0]]
		ext = fileName[dot[0]:]
	}

	return fmt.Sprintf("%s_%s%s", base, timestamp, ext)
}

func (u *UploadService) UploadMultipleFiles(ctx context.Context, files []*multipart.FileHeader, folder string) ([]string, error) {
	var filePaths []string

	for _, file := range files {
		src, err := file.Open()
		if err != nil {
			return nil, fmt.Errorf("failed to open file %s: %w", file.Filename, err)
		}
		defer src.Close()

		safeFileName := u.SafeFileName(file.Filename)
		uniqueFileName := u.appendTimestampToFileName(safeFileName)
		filePath := fmt.Sprintf("%s/%s", folder, uniqueFileName)
		escapedPath := url.PathEscape(filePath)

		contentType := file.Header.Get("Content-Type")
		err = u.s3Client.Upload(ctx, u.s3Config.Bucket, escapedPath, src, contentType)
		if err != nil {
			return nil, fmt.Errorf("upload failed for %s: %w", file.Filename, err)
		}

		filePaths = append(filePaths, filePath)
	}

	return filePaths, nil
}

func (u *UploadService) SafeFileName(fileName string) string {
	return fileNameRegex.ReplaceAllString(fileName, "_")
}

func (u *UploadService) SplitS3URLIfValidURL(URL string) (string, string, string, error) {
	matches := pattern.FindStringSubmatch(URL)
	if len(matches) == 4 {
		return matches[1], matches[2], matches[3], nil
	}
	return "", "", "", fmt.Errorf("invalid URL format")
}

func (u *UploadService) DeleteFile(ctx context.Context, fileURL string) error {
	bucket, region, path, err := u.SplitS3URLIfValidURL(fileURL)
	if err != nil {
		return fmt.Errorf("invalid S3 URL format: %w", err)
	}

	if bucket != u.s3Config.Bucket || region != u.s3Config.Region {
		return fmt.Errorf("file URL doesn't match configured bucket/region")
	}

	err = u.s3Client.DeleteObjects(ctx, u.s3Config.Bucket, []string{path})
	if err != nil {
		return fmt.Errorf("failed to delete file from S3: %w", err)
	}

	return nil
}

func (u *UploadService) GetObject(ctx context.Context, filePath string) (io.ReadCloser, error) {
	result, err := u.s3Client.GetObject(ctx, u.s3Config.Bucket, filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to get file from S3: %w", err)
	}

	return result.Body, nil
}

func (u *UploadService) ListFiles(ctx context.Context, directory string) ([]string, error) {
	return u.s3Client.ListObjectsID(ctx, u.s3Config.Bucket, directory)
}

func (u *UploadService) GetPresignedURL(ctx context.Context, filePath string, expiry time.Duration) (string, error) {
	escapedPath := url.PathEscape(u.SafeFileName(filePath))

	url, err := u.s3Client.GetPresignedURL(ctx, u.s3Config.Bucket, escapedPath, expiry)
	if err != nil {
		return "", fmt.Errorf("failed to generate presigned URL: %w", err)
	}

	return url, nil
}
