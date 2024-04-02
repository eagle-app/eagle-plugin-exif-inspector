'use strict';
const { spawn } = require('node:child_process');
const path = require('node:path');

module.exports = class {
    static async getData(filePath) {
        filePath = path.normalize(filePath);
        const ls = spawn(`${eagle.plugin.path}/modules/exif-inspector/exiftool`, ['-j', filePath]);

        try {
            let data = await new Promise((resolve, reject) => {
                ls.stdout.on('data', (data) => {
                    resolve(data.toString());
                });
                ls.stderr.on('data', (data) => {
                    reject(data);
                });
            });
            data = JSON.parse(data)[0];
            data = formatData(data);
            data = deepRemoveUndefined(data);
            return data;
        } catch (err) {
            return err;
        }
    }
};

const formatData = (exifData) => {
    return {
        CameraInfo: {
            Make: exifData['Make'],
            Model: exifData['Model'],
            LensModel: exifData['LensModel']
        },
        ShootingInfo: {
            DateTime: exifData['DateTimeOriginal'],
            ExposureTime: exifData['ExposureTime'],
            FNumber: exifData['FNumber'],
            ISOSpeedRatings: exifData['ISOSpeed'],
            ExposureBias: exifData['Exposure'],
            MaxApertureValue: exifData['MaxApertureValue'],
            MeteringMode: exifData['MeteringMode'],
            Flash: exifData['Flash'],
            FocalLength: exifData['FocalLength'],
            ExposureMode: exifData['ExposureMode'],
            ExposureProgram: exifData['ExposureProgram'],
            WhiteBalance: exifData['WhiteBalance'],
            SceneCaptureType: exifData['SceneCaptureType'],
            Contrast: exifData['Contrast'],
            Saturation: exifData['Saturation'],
            Sharpness: exifData['Sharpness']
        },
        ImageInfo: {
            Orientation: exifData['Orienation'],
            XResolution: exifData['XResolution'],
            YResolution: exifData['YResolution'],
            ResolutionUnit: exifData['ResolutionUnit'],
            Software: exifData['Software'],
            ModifyDate: exifData['ModifyDate']
        },
        GPSInfo: {
            GPSLatitude: exifData['GPSLatitude'],
            GPSLongitude: exifData['GPSLongitude'],
            GPSAltitude: exifData['GPSAltitude'],
            GPSDateTime: exifData['GPSDateTime']
        },
        ThumbnailInfo: {
            ThumbnailFormat: exifData['FileFormat'],
            ThumbnailCompression: exifData['Compression'],
            ThumbnailOffset: exifData['ThumbnailOffset'],
            ThumbnailLength: exifData['ThumbnailLength']
        },
        OtherInfo: {
            ColorSpace: exifData['ColorSpace'],
            FileSource: exifData['FileSource'],
            SceneType: exifData['SceneType'],
            CustomRendered: exifData['CustomRendered'],
            DigitalZoomRatio: exifData['DigitalZoomRatio'],
            FocalLengthIn35mmFilm: exifData['FocalLengthIn35mmFormat'],
            Artist: exifData['Artist'],
            Copyright: exifData['Copyright']
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
        } else if (obj[key] === undefined) {
            delete obj[key];
        }
    }
    return obj;
};
