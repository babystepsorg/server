"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var withVideo = function (incomingEditor) {
    var editor = incomingEditor;
    var isVoid = editor.isVoid;
    // @ts-expect-error
    editor.isVoid = function (element) { return (element.type === 'video' ? true : isVoid(element)); };
    return editor;
};
exports.default = withVideo;
