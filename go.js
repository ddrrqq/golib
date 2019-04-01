const cp = require('child_process');

/**
 * Golang 命令执行类。
 */
class Go {
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

module.exports = Go;
