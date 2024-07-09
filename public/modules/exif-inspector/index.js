'use strict';
const { spawn, exec } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs').promises;

module.exports = class {
    static async getData(filePath) {
        filePath = path.normalize(filePath);
        const exifToolName = process.platform === 'win32' ? 'exiv2.exe' : 'exiv2';
        const toolPath = path.normalize(
            `${eagle.plugin.path}/modules/exif-inspector/${exifToolName}`
        );
        // 檢查檔案權限
        if (process.platform !== 'win32') {
            try {
                await fs.access(toolPath, fs.constants.F_OK | fs.constants.X_OK);
            } catch (err) {
                await fs.chmod(toolPath, '755');
            }
        }

        const ls = spawn(toolPath, ['-PEkyct', filePath], {
            env: {
                LC_ALL: 'C',
                LANG: 'C'
            }
        });

        let data = {};
        try {
            data = await new Promise((resolve, reject) => {
                const ar = [];
                ls.stdout.on('data', (data) => {
                    ar.push(data.toString());
                });
                ls.stderr.on('data', (data) => {
                    console.error(data.toString());
                });
                ls.on('close', (code) => {
                    if (code !== 0) reject('Error: ' + code);
                    resolve(ar.join(''));
                });
            });

            data = convertJson(data);
            data = formatData(data);
            data = deepRemoveUndefined(data);
        } catch (error) {
            eagle.log.error(error);
        }
        // Feature extraction

        return data;
    }
};

const convertJson = (data) => {
    let json_merge = {};

    data.split(/\r?\n/)
        .filter((item) => item)
        .forEach((line) => {
            let ar = line.split(' ');
            ar = ar.filter((item) => item);
            ar.splice(1, 2);

            const key = ar[0].split('.').pop();
            const value = ar.splice(1).join(' ');

            json_merge[key] = value;
        });

    return json_merge;
};

const formatData = (exifData) => {
    return {
        CameraInfo: {
            Make: exifData.Make,
            Model: exifData.Model,
            LensModel: exifData.LensModel
        },
        ShootingInfo: {
            DateTime: exifData.DateTimeDigitized,
            FNumber: exifData.FNumber,
            ISOSpeedRatings: exifData.ISOSpeed,

            ExposureBias: exifData.ExposureBiasValue,
            ExposureTime: exifData.ExposureTime,
            ExposureMode: exifData.ExposureMode,
            ExposureProgram: exifData.ExposureProgram,

            MaxApertureValue: exifData.MaxApertureValue,
            MeteringMode: exifData.MeteringMode,
            Flash: exifData.Flash,
            FocalLength: exifData.FocalLength,

            WhiteBalance: exifData.WhiteBalance,
            SceneCaptureType: exifData.SceneCaptureType,
            Contrast: exifData.Contrast,
            Saturation: exifData.Saturation,
            Sharpness: exifData.Sharpness
        },
        ImageInfo: {
            Orientation: exifData.Orientation,
            XResolution: exifData.XResolution,
            YResolution: exifData.YResolution,
            ResolutionUnit: exifData.ResolutionUnit,
            Software: exifData.Software,
            ModifyDate: exifData.DateTime
        },
        GPSInfo: {
            GPSLatitude: exifData.GPSLatitude,
            GPSLongitude: exifData.GPSLongitude,
            GPSAltitude: exifData.GPSAltitude,
            GPSDateTime: (() => {
                const dateTime =
                    `${exifData.GPSDateStamp ?? ''} ${exifData.GPSTimeStamp ?? ''}`.trim();
                if (!dateTime) return undefined;
                return dateTime;
            })()
        },
        ThumbnailInfo: {
            ThumbnailFormat: exifData.JPEGInterchangeFormat,
            ThumbnailCompression: exifData.Compression,
            ThumbnailOffset: exifData.Offset,
            ThumbnailLength: exifData.JPEGInterchangeFormatLength
        },
        OtherInfo: {
            ColorSpace: exifData.ColorSpace,
            FileSource: exifData.FileSource,
            SceneType: exifData.SceneType,
            CustomRendered: exifData.CustomRendered,
            DigitalZoomRatio: exifData.DigitalZoom,
            FocalLengthIn35mmFilm: exifData.FocalLengthIn35mmFilm,
            Artist: exifData.Artist,
            Copyright: exifData.Copyright
        }
    };
};

const deepRemoveUndefined = (obj) => {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            obj[key] = deepRemoveUndefined(obj[key]);
            if (Object.keys(obj[key]).length === 0 && obj[key].constructor === Object) {
                delete obj[key];
            }
        } else if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
            delete obj[key];
        }
    }
    return obj;
};
