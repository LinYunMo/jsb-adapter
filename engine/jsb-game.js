/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

cc.game.restart = function () {
    // Need to clear scene, or native object destructor won't be invoke.
    cc.director.getScene().destroy();
    cc.Object._deferredDestroy();

    __restartVM();
};

jsb.onPause = function () {
    cc.game.emit(cc.game.EVENT_HIDE);
};

jsb.onResume = function () {
    cc.game.emit(cc.game.EVENT_SHOW);
};

function resize (size) {
    // size should be the css style
    size.width /= cc.view._devicePixelRatio;
    size.height /= cc.view._devicePixelRatio;
    window.resize(size.width, size.height);
    cc.view.setCanvasSize(window.innerWidth, window.innerHeight);
}

jsb.onResize = function (size) {
    if (size.width === 0 || size.height === 0) return;

    // getSafeAreaEdge is asynchronous on iOS, so callback later is required
    if (CC_JSB && cc.sys.os === cc.sys.OS_IOS) {
        let edges = jsb.Device.getSafeAreaEdge();
        let hasSafeArea = (edges.x > 0 || edges.y > 0 || edges.z > 0 || edges.w > 0);
        if (hasSafeArea) {
            setTimeout(() => {
                if (cc.Vec4.strictEquals(edges, jsb.Device.getSafeAreaEdge())) {
                    setTimeout(resize, 200, size);
                } else {
                    resize(size);
                }
            }, 0);
            return;
        }
    }
    resize(size);
};

