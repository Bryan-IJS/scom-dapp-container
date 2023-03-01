import { application, ControlElement, customElements, Module, Panel } from "@ijstech/components";
import { EVENT, IDappContainerData, IPageBlockData } from "@pageblock-dapp-container/interface";
import { getModule } from "@pageblock-dapp-container/utils";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['dapp-container-body']: ControlElement;
    }
  }
}

@customElements('dapp-container-body')
export class DappContainerBody extends Module {
  private pnlModule: Panel;
  private module: any;
  private isLoading: boolean = false;

  clear() {
    this.pnlModule.clearInnerHTML();
    this.module = null;
  }

  getModule() {
    return this.module;
  }
  
  async setData(rootDir: string, data: IDappContainerData) {
    if (this.isLoading) return;
    this.isLoading = true;
    if (data.content && data.content.module) {
      this.clear();
      this.module = await this.loadModule(rootDir, data.content.module);
      if (this.module) {
        await this.module.setData(data.content.properties);
        if (data.content.tag) {
          this.module.setTag(data.content.tag);
          application.EventBus.dispatch(EVENT.UPDATE_TAG, data.content.tag);
        }
      }
    }
    this.isLoading = false;
  }

  setTag(data: any) {
    if (this.module)
      this.module.setTag(data);
  }
  
  async loadModule(rootDir: string, moduleData: IPageBlockData) {
    this.clear();
    let module: any = await getModule(rootDir, moduleData);
    if (module) {
      this.pnlModule.append(module);
    }
    return module;
  }

  render() {
    return (
      <i-panel id="pnlModule"></i-panel>
    );
  }
}