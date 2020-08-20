const { ccclass, property } = cc._decorator;

@ccclass
export default class ShakingEffect extends cc.Component {

    private _speedSlider: cc.Slider = null;
    private _speedSliderLabel: cc.Label = null;

    private _strengthSlider: cc.Slider = null;
    private _strengthSliderLabel: cc.Label = null;

    private _examplesParentNode: cc.Node = null;
    private _scale: number = 0.5;

    onLoad() {
        this._speedSlider = cc.find("Canvas/speedSlider").getComponent(cc.Slider);
        this._speedSliderLabel = cc.find("Canvas/speedSlider/speedSliderLabel").getComponent(cc.Label);

        this._strengthSlider = cc.find("Canvas/strengthSlider").getComponent(cc.Slider);
        this._strengthSliderLabel = cc.find("Canvas/strengthSlider/strengthSliderLabel").getComponent(cc.Label);

        this._examplesParentNode = cc.find("Canvas/RenderList");

        this._onSliderChangedTogether()
    }

    onEnable() {
        this._speedSlider.node.on("slide", this._onSliderChangedTogether, this);
        this._strengthSlider.node.on("slide", this._onSliderChangedTogether, this);
    }

    onDisable() {
        this._speedSlider.node.off("slide", this._onSliderChangedTogether, this);
        this._strengthSlider.node.off("slide", this._onSliderChangedTogether, this);
    }

    start() {
    }

    private _onSliderChangedTogether() {
        let speedFactor = Number((this._speedSlider.progress * this._scale).toFixed(2));
        let strengthFactor = Number((this._strengthSlider.progress * this._scale).toFixed(2));
        this._speedSliderLabel.string = `${speedFactor}`;
        this._strengthSliderLabel.string = `${strengthFactor}`;
        // 更新材质
        this._updateRenderComponentMaterial(speedFactor, strengthFactor);
    }


    /**
     * 更新渲染组件的材质
     *
     * 1. 获取材质
     * 2. 给材质的 unitform 变量赋值
     * 3. 重新将材质赋值回去
     */
    private _updateRenderComponentMaterial(speedFactor, strengthFactor) {

        this._examplesParentNode.children.forEach(childNode => {
            let textureTexelSize = new cc.Vec4(1 / childNode.width, 1 / childNode.height, childNode.width, childNode.height);

            childNode.getComponents(cc.RenderComponent).forEach(renderComponent => {
                let material: cc.Material = renderComponent.getMaterial(0);
                material.setProperty("textureTexelSize", textureTexelSize);
                material.setProperty("speedFactor", speedFactor);
                material.setProperty("strengthFactor", strengthFactor);
                renderComponent.setMaterial(0, material);
            });
        });
    }
}
