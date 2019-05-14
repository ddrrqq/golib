const path = require('path');
const fs = require('fs');

class SrcJSON {
    /** @string srcPath 源码包 JSON 文件绝对路径。 */
    srcPath = SrcJSON.setPath('src.json');

    constructor(srcPath) {
        if (srcPath) {
            this.srcPath = path.isAbsolute(srcPath) ?
                srcPath : SrcJSON.setPath(srcPath);
        }
    }

    static setPath = filename => path.join(__dirname, '..', filename);

    static saveFile = (srcPath, json) => fs.writeFileSync(srcPath, json, 'utf-8');

    getJSON = () => JSON.parse(fs.readFileSync(this.srcPath).toString('utf8'));

    /**
     * 
     * @param {*} importPath 
     * @param {*} srcPath 
     * @param {*} isBuild 
     * @param {Array|string} cmd 
     */
    add(importPath, srcPath, isBuild, cmd) {
        let goSrc = this.getJSON();

        // TODO: 精简模式。

        let lib = {
            "import": importPath,
            "src": srcPath,
            "build": isBuild,
            "cmd": cmd.includes(',') ? cmd.split(','):cmd
        }

        goSrc['golib'].push(lib);
        
        SrcJSON.saveFile(this.srcPath, JSON.stringify(goSrc,null,2));
    }

    remove(importPath) {
        let goSrc = this.getJSON();

        /** @Array goLibs */
        let goLibs = goSrc['golib'];

        // TODO: 删除多个。
        for (let i = 0; i < goLibs.length; i++) {
            const item = goLibs[i];
            
            (typeof item === 'string' ?
                item === importPath :
                item['import'] === importPath) && goLibs.splice(i,1);
        }

        SrcJSON.saveFile(this.srcPath, JSON.stringify(goSrc, null, 2));
    }
}

module.exports = SrcJSON;
