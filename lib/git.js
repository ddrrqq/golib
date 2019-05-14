const cp = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Git 命令执行类
 */
class Git {
    /**
     * 执行 Git 克隆命令。
     * @param {string} goPath GOPATH 路径。
     * @param {string} importPath import 指令引入包路径。
     * @param {string} srcPath 真实 github 源码地址。
     */
    static get(goPath, importPath, srcPath) {
        let author = importPath.substring(0, importPath.lastIndexOf('/'));
        let srcDir = path.join(goPath, 'src', author);

        // TODO: 支持 HTTP1.1 协议配置。
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
     * @param {string} importPath import 指令引入包路径。
     */
    static upgrade(goPath, importPath) {
        cp.spawnSync('git', ['pull'], {
            cwd: path.join(goPath, 'src', importPath),
            stdio: 'inherit'
        });
    }
}

module.exports = Git;
