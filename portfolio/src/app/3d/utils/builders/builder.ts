import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Button } from "@babylonjs/gui/2D/controls/button";
import { Line } from "@babylonjs/gui/2D/controls/line";
import { Event, EventBus, Message } from "../../events/external/event-bus";
import { Util } from "../util";

import { environment as ENV } from "./../../../../environments/environment";

class MeshMetaData {
    cameraTarget: Vector3;
    cameraPosition: Vector3;
}

class MeshBuildOptions {
    name: string
    meshFileUri: string;
    meshfileName: string;
    referenceMeshToPosition: number;
    position: Vector3;
    referenceMeshToRotate?: number;
    rotation?: Vector3;
    renderingGroupId?: number;
    shadowGenerator?: ShadowGenerator;
    enableCollision?: boolean;
    showButton?: boolean;
    attachButtonToMesh?: number;
    meshMetaData?: MeshMetaData;
}

class TextBuildOptions {
    name: string
    meshfileName: string;
    referenceMeshToPosition: number;
    position: Vector3;
    referenceMeshToScale?: number;
    scaling?: Vector3;
    renderingGroupId?: number;
    shadowGenerator?: ShadowGenerator;
    enableCollision?: boolean;
}

export class Builder {
    public static buildMesh(
        meshBuildOptions: MeshBuildOptions,
        camera: UniversalCamera,
        advancedDynamicTexture: AdvancedDynamicTexture) {
        const renderingGroupId = !Util.isNullOrUndefined(meshBuildOptions.renderingGroupId) ? meshBuildOptions.renderingGroupId : 2;
        const referenceMeshToPosition = meshBuildOptions.referenceMeshToPosition > -1 ? meshBuildOptions.referenceMeshToPosition : 0;
        const referenceMeshToRotate = meshBuildOptions.referenceMeshToRotate > -1 ? meshBuildOptions.referenceMeshToRotate : 0;

        const attachButtonToMesh = meshBuildOptions.attachButtonToMesh > -1 ? meshBuildOptions.attachButtonToMesh : 0;
        SceneLoader.ImportMeshAsync('', `${ENV.assetsUrl}${meshBuildOptions.meshFileUri}`, meshBuildOptions.meshfileName).then((result) => {
            result.meshes.forEach((mesh) => {
                mesh.renderingGroupId = renderingGroupId;
                if (!Util.isNullOrUndefined(meshBuildOptions.shadowGenerator)) {
                    meshBuildOptions.shadowGenerator.getShadowMap().renderList.push(mesh);
                    mesh.receiveShadows = true;
                }
                mesh.checkCollisions = meshBuildOptions.enableCollision;
            });
            
            result.meshes[referenceMeshToPosition].position = meshBuildOptions.position;
            
            if(!Util.isNullOrUndefined(meshBuildOptions.rotation)) {
                result.meshes[referenceMeshToRotate].rotation = meshBuildOptions.rotation;
            }


            if (!Util.isNullOrUndefined(meshBuildOptions.meshMetaData)) {
                result.meshes[attachButtonToMesh].metadata = {};
                result.meshes[attachButtonToMesh].metadata.cameraTarget = meshBuildOptions.meshMetaData.cameraTarget;
                result.meshes[attachButtonToMesh].metadata.cameraPosition = meshBuildOptions.meshMetaData.cameraPosition;
            }

            if (!Util.isNullOrUndefined(camera) && !Util.isNullOrUndefined(advancedDynamicTexture)) {
                if (meshBuildOptions.showButton) {
                    Builder.addLabelButton(
                        meshBuildOptions.name,
                        result.meshes[meshBuildOptions.attachButtonToMesh],
                        Event.on3dModelLabelButtonClick,
                        advancedDynamicTexture,
                        camera,
                    );
                }
            }
        });
    }

    public static buildText(textBuildOptions: TextBuildOptions) {
        const renderingGroupId = !Util.isNullOrUndefined(textBuildOptions.renderingGroupId) ? textBuildOptions.renderingGroupId : 2;
        const referenceMeshToPosition = textBuildOptions.referenceMeshToPosition > -1 ? textBuildOptions.referenceMeshToPosition : 0;
        const referenceMeshToScale = textBuildOptions.referenceMeshToScale > -1 ? textBuildOptions.referenceMeshToScale : 0;

        SceneLoader.ImportMeshAsync('', `${ENV.assetsUrl}/assets/3d/texts/`, textBuildOptions.meshfileName).then((result) => {
            result.meshes.forEach((mesh) => {
                mesh.renderingGroupId = renderingGroupId;
                if (!Util.isNullOrUndefined(textBuildOptions.shadowGenerator)) {
                    textBuildOptions.shadowGenerator.getShadowMap().renderList.push(mesh);
                    mesh.receiveShadows = true;
                }
                mesh.checkCollisions = textBuildOptions.enableCollision;
            });
            
            result.meshes[referenceMeshToPosition].position = textBuildOptions.position;
            
            if(!Util.isNullOrUndefined(textBuildOptions.scaling)) {
                result.meshes[referenceMeshToScale].scaling = textBuildOptions.scaling;
            }
        });
    }

    private static addLabelButton(
        text: string,
        meshToAttach: any,
        emitEvent: Event,
        advancedDynamicTexture: AdvancedDynamicTexture,
        camera: UniversalCamera) {
        const button = Button.CreateSimpleButton(text, text);
        button.widthInPixels = 70;
        button.heightInPixels = 25;
        button.color = '#fff';
        button.alpha = 0.5;
        button.fontWeight = '250';
        button.fontSizeInPixels = 12;
        button.background = '#000';
        button.cornerRadius = 4;
        button.thickness = 0;
        button.linkOffsetYInPixels = -100;
        advancedDynamicTexture.addControl(button)
        button.linkWithMesh(meshToAttach)
        button.onPointerUpObservable.add(() => {
            EventBus.getInstance().dispatch<Message>(emitEvent, new Message(text));
            camera.position = meshToAttach.metadata.cameraPosition;
            camera.target = meshToAttach.metadata.cameraTarget;
        });
        const line = new Line();
        line.name = `line-to-button`;
        line.lineWidth = 2;
        line.dash = [3, 3];
        line.color = '#444'
        line.connectedControl = button;
        advancedDynamicTexture.addControl(line);
        line.linkWithMesh(meshToAttach);
    }
}