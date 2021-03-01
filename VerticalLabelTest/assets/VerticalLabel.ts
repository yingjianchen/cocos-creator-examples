/**

author: http://lamyoung.com/  
B站视频: https://space.bilibili.com/1756070/video  
github: https://github.com/baiyuwubing  
gitee 同步地址： https://gitee.com/lamyoung
qq 交流群: 859642112  

Cocos 论坛 ： https://forum.cocos.org/u/lamyoung/activity/topics

 */
import { _decorator, Label, BitmapFont } from 'cc';
import { verticalttf } from './VerticalTTFAssembler';
const { ccclass, menu } = _decorator;

@ccclass('VerticalLabel')
@menu('白玉无冰/VerticalLabel')
export class VerticalLabel extends Label {
    protected _flushAssembler() {
        let assembler = Label.Assembler!.getAssembler(this);
        if (this.font instanceof BitmapFont) {
            // maybetodo
        } else if (this.cacheMode === Label.CacheMode.CHAR) {
            // maybetodo
        } else {
            // 这里用我们自己写的assembler
            assembler = verticalttf
        }

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData!.material = this.material;
            }
        }
    }
}

/*
欢迎关注微信公众号 `白玉无冰`

导航：https://mp.weixin.qq.com/s/Ht0kIbaeBEds_wUeUlu8JQ

█████████████████████████████████████
█████████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄██▀▄ ▄▄██ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀▄▀▀▀█▄▀█ █   █ ████
████ █▄▄▄█ █▀ █▀▀▀ ▀▄▄ ▄ █ █▄▄▄█ ████
████▄▄▄▄▄▄▄█▄▀ ▀▄█ ▀▄█▄▀ █▄▄▄▄▄▄▄████
████▄▄  ▄▀▄▄ ▄▀▄▀▀▄▄▄ █ █ ▀ ▀▄█▄▀████
████▀ ▄  █▄█▀█▄█▀█  ▀▄ █ ▀ ▄▄██▀█████
████ ▄▀▄▄▀▄ █▄▄█▄ ▀▄▀ ▀ ▀ ▀▀▀▄ █▀████
████▀ ██ ▀▄ ▄██ ▄█▀▄ ██▀ ▀ █▄█▄▀█████
████   ▄██▄▀ █▀▄▀▄▀▄▄▄▄ ▀█▀ ▀▀ █▀████
████ █▄ █ ▄ █▀ █▀▄█▄▄▄▄▀▄▄█▄▄▄▄▀█████
████▄█▄█▄█▄█▀ ▄█▄   ▀▄██ ▄▄▄ ▀   ████
████ ▄▄▄▄▄ █▄██ ▄█▀  ▄   █▄█  ▄▀█████
████ █   █ █ ▄█▄ ▀  ▀▀██ ▄▄▄▄ ▄▀ ████
████ █▄▄▄█ █ ▄▄▀ ▄█▄█▄█▄ ▀▄   ▄ █████
████▄▄▄▄▄▄▄█▄██▄▄██▄▄▄█████▄▄█▄██████
█████████████████████████████████████
█████████████████████████████████████
*/