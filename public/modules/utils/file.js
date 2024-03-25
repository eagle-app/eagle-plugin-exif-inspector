'use strict';
const fs = require('node:fs');
const path = require('node:path');

module.exports = class {
    // 建立文件資料夾
    static createFolder = async (folderPath) => {
        folderPath = path.normalize(folderPath);
        try {
            if (!fs.existsSync(folderPath)) {
                console.log(`start create folder, path: ${folderPath}`);
                await fs.promises.mkdir(folderPath);
                console.log(`start create folder`);
            }
        } catch (error) {
            throw error;
        }
    };
    // 刪除文件資料夾
    static deleteFolder = async (folderPath) => {
        folderPath = path.normalize(folderPath);
        try {
            if (!(await this.exist(folderPath))) return;
            console.log(`start delete folder, path: ${folderPath}`);
            await fs.promises.rmdir(folderPath, { recursive: true });
            console.log(`end delete folder`);
        } catch (error) {
            throw error;
        }
    };

    static replace = async (sourcePath, targetPath) => {
        sourcePath = path.normalize(sourcePath);
        targetPath = path.normalize(targetPath);
        try {
            console.log(`start replace file, sourcePath:${sourcePath}, targetPath:${targetPath}`);

            await fs.promises.copyFile(sourcePath, targetPath);

            console.log(`end replace file`);
        } catch (error) {
            throw error;
        }
    };

    static rename = async (filePath, newName) => {
        filePath = path.normalize(filePath);
        try {
            console.log(`start rename file, path:${filePath} to ${newName}`);
            await fs.promises.rename(filePath, path.dirname(filePath) + '/' + newName);
            console.log(`end rename file`);
        } catch (error) {
            throw error;
        }
    };

    static saveAs = async (sourcePath, targetPath) => {
        // 檢查檔案是否存在
        const hasFile = async (filePath) => {
            try {
                await fs.promises.access(filePath);
                return true;
            } catch (error) {
                return false;
            }
        };
        sourcePath = path.normalize(sourcePath);
        targetPath = path.normalize(targetPath);
        try {
            console.log(`start saveAs file, sourcePath:${sourcePath}, targetPath:${targetPath}`);
            if (await hasFile(targetPath)) {
                const { dir, name, ext } = path.parse(targetPath);
                let i = 1;
                while (await hasFile(`${dir}/${name} (${i})${ext}`)) {
                    i++;
                }
                targetPath = `${dir}/${name} (${i})${ext}`;
            }
            await fs.promises.copyFile(sourcePath, targetPath);
            console.log(`end saveAs file`);
        } catch (error) {
            throw error;
        }
    };
    // 儲存文件檔案
    static save = async (filePath, buffer) => {
        filePath = path.normalize(filePath);
        try {
            console.log(`start save file, path:${filePath}`);
            await fs.promises.writeFile(filePath, buffer);
            console.log(`end save file`);
        } catch (error) {
            throw error;
        }
    };

    // 銷毀文件
    static destroy = async (filePath) => {
        filePath = path.normalize(filePath);
        try {
            console.log(`start destroy file, path:${filePath}`);
            await fs.promises.unlink(filePath);
            console.log(`end destroy file`);
        } catch (error) {
            throw error;
        }
    };
    static exist = async (filePath) => {
        filePath = path.normalize(filePath);
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            return true;
        } catch (error) {
            return false;
        }
    };
    // 檢查檔名是否不同
    static isEqualExt(ext, formatExt) {
        let a = ext.toLowerCase();
        if (a === 'jpg') a = 'jpeg';
        let b = formatExt.toLowerCase();
        if (a === b) {
            throw 'equal extension';
        }
    }

    static readChunkSync = (filePath, startPosition, length) => {
        let buffer = Buffer.alloc(length);
        const fileDescriptor = fs.openSync(filePath, 'r');

        try {
            const bytesRead = fs.readSync(fileDescriptor, buffer, {
                length,
                position: startPosition
            });

            if (bytesRead < length) buffer = buffer.subarray(0, bytesRead);

            return buffer;
        } finally {
            fs.closeSync(fileDescriptor);
        }
    };

    static convert = class {
        // file or blob
        static fileToDataURL = async (file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            try {
                return new Promise((resolve, reject) => {
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = (error) => {
                        reject(error);
                    };
                });
            } catch (err) {
                throw err;
            }
        };
        static bufferToDataURL = async (buffer, type) => {
            const blob = new Blob([buffer], { type });
            return await this.fileToDataURL(blob);
        };
    };
    static formatSize = (size, digits = 1) => {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = 0;

        const divisor = eagle.app.isMac ? 1000 : 1024;

        for (let j = 0; j < 2; j++) {
            if (size >= divisor) {
                size /= divisor;
                i++;
            }
            return (
                size.toLocaleString('en-US', {
                    maximumFractionDigits: digits
                }) + sizes[i]
            );
        }
    };
};
