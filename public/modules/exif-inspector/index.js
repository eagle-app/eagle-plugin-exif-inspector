'use strict';
const { log } = require('async');
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
        try {
            await fs.access(toolPath, fs.constants.F_OK | fs.constants.X_OK);
        } catch (err) {
            await new Promise((resolve, reject) => {
                exec(`chmod +rx "${toolPath}"`, (error, stdout, stderr) => {
                    if (error) reject(error);
                    resolve();
                });
            });
        }
        const ls = spawn(toolPath, ['-PEkyct', filePath], {
            // env: {
            //     LC_ALL: 'C',
            //     LANG: 'C'
            // }
        });

        try {
            let data = await new Promise((resolve, reject) => {
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

            // Feature extraction
            data = convertJson(data).Exif;
            data = formatData(data);
            data = deepRemoveUndefined(data);

            return data;
        } catch (err) {
            throw err;
        }
    }
};

const convertJson = (data) => {
    console.log(data);

    let json_merge = {};

    data.split('\r\n')
        .filter((item) => item)
        .forEach((line) => {
            let ar = line.split(' ');
            ar = ar.filter((item) => item);
            ar.splice(1, 2);

            const keys = ar[0].split('.');

            let current_json = json_merge;
            for (let key = 0; key < keys.length; key++) {
                if (key === keys.length - 1) {
                    current_json[keys[key]] = ar.splice(1).join(' ');
                } else {
                    current_json[keys[key]] = current_json[keys[key]] || {};
                    current_json = current_json[keys[key]];
                }
            }
        });

    return json_merge;
};

const formatData = (exifData) => {
    return {
        CameraInfo: {
            Make: null,
            Model: null,
            LensModel: null
        },
        ShootingInfo: {
            DateTime: null,
            FNumber: null,
            ISOSpeedRatings: null,
            ExposureBias: null,
            MaxApertureValue: null,
            MeteringMode: null,
            Flash: null,
            FocalLength: null,

            HDR: null,

            ExposureTime: null,
            ExposureMode: null,
            ExposureProgram: null,

            WhiteBalance: null,
            SceneCaptureType: null,
            Contrast: null,
            Saturation: null,
            Sharpness: null
        },
        ImageInfo: {
            Orientation: null,
            XResolution: null,
            YResolution: null,
            ResolutionUnit: null,
            Software: null,
            ModifyDate: null
        },
        GPSInfo: {
            GPSLatitude: null,
            GPSLongitude: null,
            GPSAltitude: null,
            GPSDateTime: null
        },
        ThumbnailInfo: {
            ThumbnailFormat: null,
            ThumbnailCompression: null,
            ThumbnailOffset: null,
            ThumbnailLength: null
        },
        OtherInfo: {
            ColorSpace: null,
            FileSource: null,
            SceneType: null,
            CustomRendered: null,
            DigitalZoomRatio: null,
            FocalLengthIn35mmFilm: null,
            Artist: null,
            Copyright: null
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

const isHDR = (exifData) => {
    if (exifData.HDRImageType?.includes('HDR')) return true;
    // 可能還有其他評判標準
    return false;
};
