import { application, customModule, GridLayout, Module, Panel, Styles } from "@ijstech/components";
import { EVENT, IDappContainerData } from "@pageblock-dapp-container/interface";
import styleClass from './index.css';
import { DappContainerBody } from './body';
import { updateStore } from "@pageblock-dapp-container/store";
import { DappContainerHeader } from "./header";
import { Wallet } from "@ijstech/eth-wallet";
export { DappContainerBody } from './body';
export { DappContainerHeader } from './header';
export { DappContainerFooter } from './footer';

const Theme = Styles.Theme.ThemeVars;

@customModule
export class DappContainer extends Module {
  private pnlLoading: Panel;
  private gridMain: GridLayout;
  private dappContainerHeader: DappContainerHeader;
  private dappContainerBody: DappContainerBody;
  private _data: IDappContainerData | undefined;

  async init() {
    super.init();
    application.EventBus.register(this, EVENT.UPDATE_TAG, this.setTag);
  }

  async getData() {
    return this._data;
  }

  async setData(data: IDappContainerData) {
    this.pnlLoading.visible = true;
    this.gridMain.visible = false;
    this._data = data;
    updateStore(this._data);
    this.dappContainerHeader.reloadWalletsAndNetworks();
    if (!this._data) {
      this.dappContainerBody.clear();
      return;
    }
    await this.renderPageByConfig();
    this.pnlLoading.visible = false;
    this.gridMain.visible = true;
  }

  getActions() {
    let module = this.dappContainerBody.getModule();
    let actions;
    if (module && module.getActions) {
      actions = module.getActions();
    }
    return actions;
  }

  getTag() {
    return this.tag;
  }

  setTag(value: any) {
    this.tag = value;
    this.dappContainerBody.setTag(value);
    this.updateTheme();
  }

  private updateTheme() {
    if (this.tag?.fontColor)
      this.style.setProperty('--text-primary', this.tag.fontColor);
    if (this.tag?.backgroundColor)
      this.style.setProperty('--background-main', this.tag.backgroundColor);
    if (this.tag?.inputFontColor)
      this.style.setProperty('--input-font_color', this.tag.inputFontColor);
    if (this.tag?.inputBackgroundColor)
      this.style.setProperty('--input-background', this.tag.inputBackgroundColor);
  }
  
  async renderPageByConfig() {
    await this.dappContainerBody.setData(this._data);
  }

  render() {
    return (
      <i-vstack class={styleClass} width="100%" height="100%" background={{ color: Theme.background.main }}>
        <dapp-container-header id="dappContainerHeader"></dapp-container-header>
        <i-panel stack={{ grow: "1" }} overflow="hidden">
          <i-vstack
            id="pnlLoading"
            height="100%"
            horizontalAlignment="center"
            verticalAlignment="center"
            padding={{ top: "1rem", bottom: "1rem", left: "1rem", right: "1rem" }}
            visible={false}
          >
            <i-panel class={'spinner'}></i-panel>
          </i-vstack>
          <i-grid-layout id="gridMain" height="100%" templateColumns={["1fr"]}>
            <dapp-container-body id="dappContainerBody" overflow="auto"></dapp-container-body>
          </i-grid-layout>
        </i-panel>
        <dapp-container-footer></dapp-container-footer>
      </i-vstack>
    )
  }
}