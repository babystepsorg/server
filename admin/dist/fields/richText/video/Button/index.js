"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-extraneous-dependencies */
var react_1 = __importStar(require("react"));
var modal_1 = require("@faceless-ui/modal");
var slate_1 = require("slate");
var slate_react_1 = require("slate-react");
var richtext_slate_1 = require("@payloadcms/richtext-slate");
var forms_1 = require("payload/components/forms");
var components_1 = require("payload/components");
var Icon_1 = __importDefault(require("../Icon"));
require("./index.scss");
var initialFormData = {
    source: 'youtube',
};
var sources = [
    {
        label: 'YouTube',
        value: 'youtube',
    },
    {
        label: 'Vimeo',
        value: 'vimeo',
    },
];
var baseClass = 'video-rich-text-button';
var insertVideo = function (editor, _a) {
    var id = _a.id, source = _a.source;
    var text = { text: ' ' };
    var video = {
        type: 'video',
        id: id,
        source: source,
        children: [text],
    };
    var nodes = [video, { type: 'p', children: [{ text: '' }] }];
    if (editor.blurSelection) {
        slate_1.Transforms.select(editor, editor.blurSelection);
    }
    slate_1.Transforms.insertNodes(editor, nodes);
    slate_react_1.ReactEditor.focus(editor);
};
var VideoButton = function (_a) {
    var path = _a.path;
    var _b = (0, modal_1.useModal)(), openModal = _b.openModal, toggleModal = _b.toggleModal;
    var editor = (0, slate_react_1.useSlate)();
    var _c = (0, react_1.useState)(false), renderModal = _c[0], setRenderModal = _c[1];
    var modalSlug = "".concat(path, "-add-video");
    var handleAddVideo = (0, react_1.useCallback)(function (_, _a) {
        var id = _a.id, source = _a.source;
        insertVideo(editor, { id: id, source: source });
        toggleModal(modalSlug);
        setRenderModal(false);
    }, [editor, toggleModal]);
    (0, react_1.useEffect)(function () {
        if (renderModal) {
            openModal(modalSlug);
        }
    }, [renderModal, openModal, modalSlug]);
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(richtext_slate_1.ElementButton, { className: baseClass, format: "video", onClick: function (e) {
                e.preventDefault();
                setRenderModal(true);
            } },
            react_1.default.createElement(Icon_1.default, null)),
        renderModal && (react_1.default.createElement(modal_1.Modal, { slug: modalSlug, className: "".concat(baseClass, "__modal") },
            react_1.default.createElement(components_1.MinimalTemplate, { className: "".concat(baseClass, "__template") },
                react_1.default.createElement("header", { className: "".concat(baseClass, "__header") },
                    react_1.default.createElement("h3", null, "Add Video"),
                    react_1.default.createElement(components_1.Button, { buttonStyle: "none", onClick: function () {
                            toggleModal(modalSlug);
                            setRenderModal(false);
                        } },
                        react_1.default.createElement(components_1.X, null))),
                react_1.default.createElement(forms_1.Form, { onSubmit: handleAddVideo, initialData: initialFormData },
                    react_1.default.createElement(forms_1.Select, { required: true, label: "Video Source", options: sources, name: "source" }),
                    react_1.default.createElement(forms_1.Text, { label: "ID", required: true, name: "id" }),
                    react_1.default.createElement(forms_1.Submit, null, "Add video")))))));
};
exports.default = VideoButton;
