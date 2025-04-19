package gormslog

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"time"

	"gorm.io/gorm"
	gormlogger "gorm.io/gorm/logger"
	gormutils "gorm.io/gorm/utils"
)

type GormSlogOption struct {
	IgnoreNotFound bool
	SlowThreshold  time.Duration
}

type GormSlog struct {
	log            *slog.Logger
	ignoreNotFound bool
	slowThreshold  time.Duration
}

func New(log *slog.Logger, opt GormSlogOption) *GormSlog {
	return &GormSlog{
		log:            log,
		ignoreNotFound: opt.IgnoreNotFound,
		slowThreshold:  opt.SlowThreshold,
	}
}

// Ignoring LogMode
func (g *GormSlog) LogMode(gormlogger.LogLevel) gormlogger.Interface {
	return g
}

func (g *GormSlog) Info(ctx context.Context, msg string, data ...interface{}) {
	g.log.InfoContext(ctx, msg,
		"data", fmt.Sprint(data...),
		"trace", gormutils.FileWithLineNum(),
	)
}

func (g *GormSlog) Warn(ctx context.Context, msg string, data ...interface{}) {
	g.log.WarnContext(ctx, msg,
		"data", fmt.Sprint(data...),
		"trace", gormutils.FileWithLineNum(),
	)
}

func (g *GormSlog) Error(ctx context.Context, msg string, data ...interface{}) {
	g.log.ErrorContext(ctx, msg,
		"data", fmt.Sprint(data...),
		"trace", gormutils.FileWithLineNum(),
	)
}

func (g *GormSlog) Trace(ctx context.Context, begin time.Time, fc func() (sql string, rowsAffected int64), err error) {
	elapsed := time.Since(begin)
	switch {
	case err != nil && (!errors.Is(err, gorm.ErrRecordNotFound) || !g.ignoreNotFound):
		sql, rows := fc()
		g.log.ErrorContext(ctx, "gorm error",
			"error", err,
			"elapsedMillisecond", float64(elapsed.Nanoseconds())/1e6,
			"rowsAffected", rows,
			"sql", sql,
			"trace", gormutils.FileWithLineNum(),
		)
	case elapsed > g.slowThreshold && g.slowThreshold != 0:
		sql, rows := fc()
		g.log.WarnContext(ctx, "gorm slow query",
			"elapsedMillisecond", float64(elapsed.Nanoseconds())/1e6,
			"tresholdMillisecond", float64(g.slowThreshold.Nanoseconds())/1e6,
			"rowsAffected", rows,
			"sql", sql,
			"trace", gormutils.FileWithLineNum(),
		)
	default:
		sql, rows := fc()
		g.log.InfoContext(ctx, "gorm query",
			"elapsedMillisecond", float64(elapsed.Nanoseconds())/1e6,
			"rowsAffected", rows,
			"sql", sql,
			"trace", gormutils.FileWithLineNum(),
		)
	}
}
