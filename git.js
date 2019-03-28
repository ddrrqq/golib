const cp = require('child_process');
const path = require('path');
const fs = require('fs');
// const url = require('url');

class Git {
    /**
     * 执行 Git 克隆命令。
     * @param {string} goPath GOPATH 路径。
     * @param {string} importPath import 指令路径。
     * @param {string} srcPath 真实 github 源码地址。
     */
    static get(goPath, importPath, srcPath) {
        let author = importPath.substring(0, importPath.lastIndexOf('/'));
        let srcDir = path.join(goPath, 'src', author);

        let remote = new URL('https:' + srcPath);
        remote.protocol = 'https';
        remote.pathname += '.git';

        fs.existsSync(srcDir) || fs.mkdirSync(srcDir, { recursive: true });
        cp.spawnSync('git', ['clone', '--depth', '1', remote.href], {
            cwd: srcDir,
            stdio: 'inherit'
        });
    }

    /**
     * 执行 Git 拉取命令。
     * @param {string} goPath GOPATH 路径。
     * @param {string} importPath import 指令路径。
     */
    static upgrade(goPath, importPath) {
        cp.spawnSync('git', ['pull'], {
            cwd: path.join(goPath, 'src', importPath),
            stdio: 'inherit'
        });
    }

    static build(goPath, importPath) {
        
    }
}

module.exports = Git;
