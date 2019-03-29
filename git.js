const cp = require('child_process');
const path = require('path');
const fs = require('fs');

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

    /**
     * 编译支持命令行的包。
     * @param {string} goPath GOPATH 路径。
     * @param {string} importPath import 指令引入包路径。
     */
    static build(importPath, cmdPath) {
        cp.spawnSync(
            'go', [
                'install',
                '-ldflags', '-s -w', // 减小体积。
                importPath + (cmdPath || '')
            ],
            { stdio: 'inherit' }
        );
    }
}

module.exports = Git;
