const path = require('path');
const fs = require('fs');

/**
 * @class SrcJSON src JSON 文件操作类。
 */
class SrcJSON {
    /**
     * 构造 JSON 文件操作实例。
     * @param {string} srcPath src JSON 文件路径。（默认为 src.json）
     */
    constructor(srcPath = 'src.json') {
        this.srcPath = path.isAbsolute(srcPath) ?
            srcPath : SrcJSON.setPath(srcPath);
    }

    /** 设定 JSON 文件相对路径。 */
    static setPath(filename) {
        return path.join(__dirname, '..', filename);
    }

    /** 存储 JSON 文件。 */
    static saveFile(srcPath, json) {
        return fs.writeFileSync(srcPath, json, 'utf-8');
    }

    /**
     * 获取 JSON 文件内容。
     * @returns{string} JSON 字符串。
     */
    getJSON() {
        return JSON.parse(fs.readFileSync(this.srcPath).toString('utf8'));
    }

    /**
     * 添加一个包。
     * @param {string} importPath 
     * @param {string} srcPath 
     * @param {boolean} isBuild 
     * @param {Array|string} cmd 
     */
    add(importPath, srcPath, isBuild, cmd) {
        let goSrc = this.getJSON();

        // TODO: 精简模式。

        // 新加入的包信息。
        let lib = {
            "import": importPath,
            "src": srcPath,
            "build": isBuild,
            "cmd": cmd && cmd.includes(',') ? cmd.split(',') : cmd
        };

        // 追加到包数组。
        goSrc['golib'].push(lib);

        // 保存到 JSON 文件。
        SrcJSON.saveFile(this.srcPath, JSON.stringify(goSrc, null, 2));

        console.info(`[+] ${ importPath }`);
    }

    /**
     * 删除一个包。
     * @param {string} importPath import 包路径。
     */
    remove(importPath) {
        let goSrc = this.getJSON();
        let goLibs = goSrc['golib'];

        // TODO: 删除多个。

        // 遍历整个包数组。
        for (let i = 0; i < goLibs.length; i++) {
            const item = goLibs[i];

            // 包含对应 import 路径则移除。
            (typeof item === 'string' ?
                item === importPath :
                item['import'] === importPath) && goLibs.splice(i, 1);
        }

        // 保存到 JSON 文件。
        SrcJSON.saveFile(this.srcPath, JSON.stringify(goSrc, null, 2));

        console.info(`[-] ${ importPath }`);
    }
}

module.exports = SrcJSON;
