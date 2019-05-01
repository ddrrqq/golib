const path = require('path');
const cp = require('child_process');

/**
 * Golang 命令执行类。
 */
class Go {
    /**
     * 编译支持命令行的包。
     * @param {string} importPath import 指令引入包路径。
     * @param {string} cmdPath 命令行 cmd 入口专用路径。
     */
    static build(importPath, cmdPath) {
        let cmdFullPath = path.join(importPath, cmdPath);

        cp.spawnSync(
            'go', [
                'install',
                '-ldflags', '-s -w', // 减小体积。
                cmdFullPath
            ],
            { stdio: 'inherit' }
        );
        // console.log(`[${ cmdFullPath }] has been compiled!`);
        console.log(`[${ cmdFullPath }] ✓`);
    }

    /**
     * 编译支持命令行的包中多个命令程序。
     * @param {string} importPath import 指令引入包路径。
     * @param {Array<string>} cmdPaths 命令行 cmd 入口专用路径数组。
     */
    static multiBuild(importPath, cmdPaths) {
        cmdPaths.forEach(i => {
            Go.build(importPath, i);
        });
    }
}

module.exports = Go;
