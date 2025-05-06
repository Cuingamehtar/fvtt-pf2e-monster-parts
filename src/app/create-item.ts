import { PhysicalItemPF2e } from "foundry-pf2e";
import { ApplicationRenderContext, ApplicationRenderOptions } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import ApplicationV2 from "foundry-pf2e/foundry/client-esm/applications/api/application.js";

class CreateItemApplication extends ApplicationV2 {
    protected _renderHTML(context: ApplicationRenderContext, options: ApplicationRenderOptions): Promise<unknown> {
        throw new Error("Method not implemented.");
    }
    protected _replaceHTML(result: unknown, content: HTMLElement, options: ApplicationRenderOptions): void {
        throw new Error("Method not implemented.");
    }

    async #onDrop(event: DragEvent, el:HTMLElement){
        const data = TextEditor.getDragEventData(event);
        if (typeof data.uuid !== "string")
            return;
        const item = await fromUuid<PhysicalItemPF2e>(data.uuid);

        console.log(el, item);
    }

}