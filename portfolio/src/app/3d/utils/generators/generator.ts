import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Scene } from "@babylonjs/core/scene";
import { Util } from "../util";

import { environment as ENV } from "./../../../../environments/environment";

class FireworkOptions {
    position?: Vector3;
    rotationZ?: number;
    renderingGroupId?: number;

    constructor(position?: Vector3, rotationZ?: number, renderingGroupId?: number) {
        this.position = position;
        this.rotationZ = rotationZ;
        this.renderingGroupId = renderingGroupId;
    }
}

class FireOptions {
    position?: Vector3;
    renderingGroupId?: number;

    constructor(position?: Vector3, renderingGroupId?: number) {
        this.position = position;
        this.renderingGroupId = renderingGroupId;
    }
}

class SmokeOptions {
    position?: Vector3;
    renderingGroupId?: number;

    constructor(position?: Vector3, renderingGroupId?: number) {
        this.position = position;
        this.renderingGroupId = renderingGroupId;
    }
}

class ForestOptions {
    position?: Vector3;
    renderingGroupId?: number;

    constructor(position?: Vector3, renderingGroupId?: number) {
        this.position = position;
        this.renderingGroupId = renderingGroupId;
    }
}

export class Generator {
    public static generateFirework(fireworkOptions: FireworkOptions, scene: Scene) {
        const position = !Util.isNullOrUndefined(fireworkOptions.position) ? fireworkOptions.position : Vector3.Zero();
        const renderingGroupId = !Util.isNullOrUndefined(fireworkOptions.renderingGroupId) ? fireworkOptions.renderingGroupId: 2;

        const fireworkSource = MeshBuilder.CreateBox("fireworkSource", { size: 0.01 }, scene);
        fireworkSource.position = position;
        if (!Util.isNullOrUndefined(fireworkOptions.rotationZ)) {
            fireworkSource.rotation.z = fireworkOptions.rotationZ;
        }
        fireworkSource.renderingGroupId = renderingGroupId;

        const particleSystem = new ParticleSystem("particles-firework", 1000, scene);
        particleSystem.emitter = fireworkSource;
        particleSystem.minEmitBox = new Vector3(-1, 0, 0);
        particleSystem.maxEmitBox = new Vector3(1, 0, 0);
        particleSystem.createConeEmitter(1.5);
        particleSystem.particleTexture = new Texture(`${ENV.assetsUrl}/assets/3d/particles/textures/flare.png`, scene);
        particleSystem.renderingGroupId = renderingGroupId;
        

        particleSystem.color1 = new Color4(1, 0, 0);
        particleSystem.color2 = new Color4(0, 0.7, 0);
        particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);

        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.3;

        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;

        particleSystem.emitRate = 500;

        particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;

        particleSystem.gravity = new Vector3(0, -9.81, 0);

        particleSystem.direction1 = new Vector3(0, 5, 0);
        particleSystem.direction2 = new Vector3(5, 5, 0);

        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = Math.PI;

        particleSystem.minEmitPower = 5;
        particleSystem.maxEmitPower = 10;
        particleSystem.updateSpeed = 0.005;

        particleSystem.isLocal = true;

        particleSystem.start();
    }

    public static generateFire(fireOptions: FireOptions, scene: Scene) {
        const position = !Util.isNullOrUndefined(fireOptions.position) ? fireOptions.position : Vector3.Zero();
        const renderingGroupId = !Util.isNullOrUndefined(fireOptions.renderingGroupId) ? fireOptions.renderingGroupId: 2;

        const fireSource = MeshBuilder.CreateBox("fireSource", { size: 0.01 }, scene);
        fireSource.position = position;
        fireSource.renderingGroupId = renderingGroupId;

        const particleSystem = new ParticleSystem("particles-fire", 8000, scene);
        particleSystem.createConeEmitter(0.0001);
        particleSystem.emitter = fireSource
        particleSystem.minEmitBox = position;
        particleSystem.maxEmitBox = new Vector3(1, 1, 1);
        particleSystem.particleTexture = new Texture(`${ENV.assetsUrl}/assets/3d/particles/textures/fire.png`, scene);
        particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
        particleSystem.renderingGroupId = renderingGroupId;

        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 0.5;

        particleSystem.emitRate = 1000;

        particleSystem.gravity = new Vector3(0.25, 1.5, 0);

        particleSystem.addSizeGradient(0, 0.2, 0.2);
        particleSystem.addSizeGradient(0.7, 0.3, 0.3);
        particleSystem.addSizeGradient(1, 0.3, 0.3);

        particleSystem.addColorGradient(0, new Color4(1, 0.5, 0.1, 0), new Color4(0.8, 0.8, 0.8, 0));
        particleSystem.addColorGradient(0.7, new Color4(1, 0.5, 0, 0), new Color4(0.9, 0.5, 0.1, 0.9));
        particleSystem.addColorGradient(1.0, new Color4(1, 0.5, 0, 0), new Color4(1, 0.9, 0.1, 0));

        particleSystem.addVelocityGradient(0, 1, 1.5);
        particleSystem.addVelocityGradient(0.7, 0.4, 0.5);
        particleSystem.addVelocityGradient(1, 0.1, 0.2);

        particleSystem.start();
    }

    public static generateSmoke(smokeOptions: SmokeOptions, scene: Scene) {
        const position = !Util.isNullOrUndefined(smokeOptions.position) ? smokeOptions.position : Vector3.Zero();
        const renderingGroupId = !Util.isNullOrUndefined(smokeOptions.renderingGroupId) ? smokeOptions.renderingGroupId: 2;

        const smokeSource = MeshBuilder.CreateBox("smokeSource", { size: 0.1 }, scene);
        smokeSource.position = position;
        smokeSource.renderingGroupId = renderingGroupId;

        const particleSystem = new ParticleSystem("particles-smoke", 8000, scene);
        particleSystem.createSphereEmitter(0.1);
        particleSystem.emitter = smokeSource
        particleSystem.minEmitBox = position;
        particleSystem.maxEmitBox = new Vector3(0.5, 0.5, 0.5);
        particleSystem.particleTexture = new Texture(`${ENV.assetsUrl}/assets/3d/particles/textures/smoke.png`, scene);
        particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
        particleSystem.renderingGroupId = renderingGroupId;

        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 6;

        particleSystem.emitRate = 100;

        particleSystem.gravity = new Vector3(0.25, 1.5, 0);

        particleSystem.addSizeGradient(0, 0.6, 1);
        particleSystem.addSizeGradient(0.3, 1, 2);
        particleSystem.addSizeGradient(0.5, 2, 3);
        particleSystem.addSizeGradient(1.0, 6, 8);

        particleSystem.addColorGradient(0, new Color4(1, 1, 1, 0), new Color4(0.8, 0.8, 0.8, 0));
        particleSystem.addColorGradient(0.4, new Color4(1, 1, 1, 0), new Color4(0.7, 0.7, 0.7, 0.2));
        particleSystem.addColorGradient(0.7, new Color4(1, 1, 1, 0), new Color4(0.7, 0.7, 0.7, 0.2));
        particleSystem.addColorGradient(1.0, new Color4(1, 1, 1, 0), new Color4(0.7, 0.7, 0.7, 0));

        particleSystem.addVelocityGradient(0, 1, 1.5);
        particleSystem.addVelocityGradient(0.1, 0.8, 0.9);
        particleSystem.addVelocityGradient(0.7, 0.4, 0.5);
        particleSystem.addVelocityGradient(1, 0.1, 0.2);

        particleSystem.minInitialRotation = 0;
        particleSystem.maxInitialRotation = Math.PI;
        particleSystem.minAngularSpeed = -1;
        particleSystem.maxAngularSpeed = 1;

        particleSystem.start();
    }

    public static generateForest(forestOptions: ForestOptions, scene: Scene) {
        const position = !Util.isNullOrUndefined(forestOptions.position) ? forestOptions.position : Vector3.Zero();
        const renderingGroupId = !Util.isNullOrUndefined(forestOptions.renderingGroupId) ? forestOptions.renderingGroupId: 2;

        SceneLoader.LoadAssetContainer(`${ENV.assetsUrl}/assets/3d/meshes/`, "tree.gltf", scene, (result) => {
            result.meshes.forEach((mesh: AbstractMesh) => mesh.renderingGroupId = renderingGroupId);
            result.meshes[0].position = position;
            result.addAllToScene();

            const range = 10000;
            for (let i = 1; i <= 300; i++) {
                let x = (range / 2 - Math.random() * (range + (new Date().getTime() % 100))) / 2;
                let z = (range / 2 - Math.random() * (range + (new Date().getTime() % 1000))) / 2;
                let insideXBoundary = x > -300 && x < 300;
                let insideZBoundary = z > -300 && z < 60;

                if (insideXBoundary || insideZBoundary) {
                    continue;
                }

                const entries = result.instantiateModelsToScene(undefined, false, { doNotInstantiate: true });
                for (const node of entries.rootNodes) {
                    node.position.x = x;
                    node.position.z = z;
                }
            }
        });
    }
}