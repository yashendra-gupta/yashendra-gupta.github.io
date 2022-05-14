import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { CubeTexture, StandardMaterial } from "@babylonjs/core/Materials";

import { TerrainMaterial } from '@babylonjs/materials/terrain';

import { AdvancedDynamicTexture } from '@babylonjs/gui/2D';

import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Animations/animatable";

import { AxesViewer } from "@babylonjs/core/Debug/axesViewer";

import { environment as ENV } from "../../environments/environment";
import { DirectionalLight, GlowLayer, ShadowGenerator, Sound } from "@babylonjs/core";
import { Generator } from "./utils/generators/generator";
import { Builder } from "./utils/builders/builder";

import rain from "./utils/generators/configuration/particle-system/rain.json";
import snow from "./utils/generators/configuration/particle-system/snow.json";
import hailstorm from "./utils/generators/configuration/particle-system/hailstorm.json";
import hailstormG from "./utils/generators/configuration/particle-system/hailstormG.json";
import autumn from "./utils/generators/configuration/particle-system/autumn.json";
import autumnG from "./utils/generators/configuration/particle-system/autumnG.json";
import lightning from "./utils/generators/configuration/particle-system/lightning.json";
import { ParticleGenerator } from "./utils/generators/particles.generator";

export class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: UniversalCamera;
    private _light: HemisphericLight;
    private _AdvancedDynamicTexture: AdvancedDynamicTexture;

    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);
        this._camera = new UniversalCamera('UniversalCamera', new Vector3(0, 0, 52), this._scene);
        this._light = new HemisphericLight('HemisphericLight', new Vector3(1, 1, 0), this._scene);
        this._AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI("myUI");
        new GlowLayer("glow", this._scene);
    }

    run() {
        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;
        this.createScene();
        this.doRender();
    }

    private createScene(): void {
        //new AxesViewer(this._scene, 5,1);

        this._scene.clearColor = new Color4(0.92, 0.96, 0.97);

        this._scene.fogMode = Scene.FOGMODE_LINEAR;
        this._scene.fogStart = 300.0;
        this._scene.fogEnd = 1000.0;
        this._scene.fogColor = new Color3(0, 0.3, 0);

        this._camera.attachControl(this._canvas, false);
        this._camera.setTarget(new Vector3(0, 0, 0));
        this._camera.speed = 1;
        this._camera.applyGravity = true;
        this._camera.minZ = 0;

        this._camera.checkCollisions = true;
        this._scene.gravity = new Vector3(0, -0.4, 0);
        this._scene.collisionsEnabled = true;
        this._camera.ellipsoid = new Vector3(1, 1, 0.5);

        const directionalLight = new DirectionalLight("directionalLight", new Vector3(-1, -2, -1), this._scene);
        directionalLight.position = new Vector3(-20, 35, 20);
        directionalLight.intensity = 0.1;
        const shadowGenerator = new ShadowGenerator(1024, directionalLight);

        const ground = MeshBuilder.CreateGround('ground', { width: 10000, height: 10000, subdivisions: 1 }, this._scene);
        ground.position = new Vector3(0, 0, 0);
        ground.renderingGroupId = 1;

        var terrainMaterial = new TerrainMaterial("terrainMaterial", this._scene);
        terrainMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
        terrainMaterial.specularPower = 64;
        terrainMaterial.mixTexture = new Texture(`${ENV.assetsUrl}/assets/3d/envs/terrains/ground-grass/stencil.png`, this._scene);
        terrainMaterial.diffuseTexture1 = new Texture(`${ENV.assetsUrl}/assets/3d/envs/terrains/ground-grass/ground-grass.png`, this._scene);
        terrainMaterial.diffuseTexture2 = new Texture(`${ENV.assetsUrl}/assets/3d/envs/terrains/ground-grass/ground-grass.png`, this._scene);
        terrainMaterial.diffuseTexture3 = new Texture(`${ENV.assetsUrl}/assets/3d/envs/terrains/ground-grass/ground-grass.png`, this._scene);
        terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 500;
        terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 500;
        terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 500;

        ground.material = terrainMaterial;

        var skybox = MeshBuilder.CreateBox("skyBox", { size: 100 }, this._scene);
        skybox.position = new Vector3(0, 49, 0);
        var skyboxMaterial = new StandardMaterial("skyBox", this._scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;
        skyboxMaterial.reflectionTexture = new CubeTexture(`${ENV.assetsUrl}/assets/3d/envs/skyboxes/sunrise/`, this._scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skybox.renderingGroupId = 0;

        Generator.generateForest({ position: new Vector3(0, 0, 700) }, this._scene);

        Builder.buildMesh({
            name: 'Portfolio',
            meshFileUri: '/assets/3d/meshes/',
            meshfileName: 'stage.gltf',
            referenceMeshToPosition: 0,
            position: new Vector3(0, 0, 0),
            shadowGenerator: shadowGenerator,
            enableCollision: true,
            showButton: true,
            attachButtonToMesh: 0,
            meshMetaData: {
                cameraTarget: new Vector3(-1, 0, 0),
                cameraPosition: new Vector3(0, 0, 40)
            }
        }, this._camera, this._AdvancedDynamicTexture);
        Builder.buildText({
            name: 'welcome-to-yashendra-gupta-portfolio',
            meshfileName: 'welcome-to-yashendra-gupta-portfolio.gltf',
            referenceMeshToPosition: 0,
            position: new Vector3(0, 6.5, 1),
            referenceMeshToScale: 0,
            scaling: new Vector3(1.5, 1.5, 1.5),
            shadowGenerator: shadowGenerator
        });
        Generator.generateFirework({ position: new Vector3(8, 7, 0), rotationZ: -0.5 }, this._scene);
        Generator.generateFirework({ position: new Vector3(5, 9.5, 0) }, this._scene);
        Generator.generateFirework({ position: new Vector3(0, 8.5, 0) }, this._scene);
        Generator.generateFirework({ position: new Vector3(-5, 9.5, 0) }, this._scene);
        Generator.generateFirework({ position: new Vector3(-8, 7, 0), rotationZ: 0.5 }, this._scene);
        Generator.generateFire({ position: new Vector3(1.7, 1.56, 8.1) }, this._scene);
        Generator.generateFire({ position: new Vector3(-1.7, 1.56, 8.1) }, this._scene);
        Builder.buildMesh({
            name: 'Man',
            meshFileUri: '/assets/3d/characters/',
            meshfileName: 'man.gltf',
            referenceMeshToPosition: 0,
            position: new Vector3(0, 1.56, 7.5),
        }, this._camera, this._AdvancedDynamicTexture);

        Builder.buildMesh({
            name: 'Skills',
            meshFileUri: '/assets/3d/meshes/',
            meshfileName: 'forge-building.gltf',
            referenceMeshToPosition: 0,
            position: new Vector3(-145, 0, -200),
            referenceMeshToRotate: 0,
            rotation: new Vector3(0, 10, 0),
            shadowGenerator: shadowGenerator,
            enableCollision: true,
            showButton: true,
            attachButtonToMesh: 1,
            meshMetaData: {
                cameraTarget: new Vector3(-145, 0, -200),
                cameraPosition: new Vector3(-105, 0, -180)
            }
        }, this._camera, this._AdvancedDynamicTexture);
        Generator.generateSmoke({ position: new Vector3(-126, 20, -209) }, this._scene);
        Generator.generateSmoke({ position: new Vector3(-131, 25, -209) }, this._scene);
        Generator.generateSmoke({ position: new Vector3(-126, 18, -203) }, this._scene);

        Builder.buildMesh({
            name: 'Find me here',
            meshFileUri: '/assets/3d/meshes/',
            meshfileName: 'sign-board-find-me-here.gltf',
            referenceMeshToPosition: 0,
            position: new Vector3(-15, 0, 20), shadowGenerator: shadowGenerator, enableCollision: true
        }, this._camera, this._AdvancedDynamicTexture);
        Builder.buildText({
            name: 'linkedino',
            meshfileName: 'linkedin.gltf',
            referenceMeshToPosition: 0,
            position: new Vector3(-16, 0, 22),
            shadowGenerator: shadowGenerator,
            enableCollision: true
        });
        Builder.buildText({
            name: 'github',
            meshfileName: 'github.gltf',
            referenceMeshToPosition: 0,
            position: new Vector3(-15.5, 0, 21),
            shadowGenerator: shadowGenerator,
            enableCollision: true
        });

        Builder.buildText({
            name: 'head-to-source-code',
            meshfileName: 'head-to-source-code.gltf',
            referenceMeshToPosition: 0,
            position: new Vector3(15, 0, 20),
            shadowGenerator: shadowGenerator,
            enableCollision: true
        });

        Builder.buildMesh({
            name: 'Education',
            meshFileUri: '/assets/3d/meshes/',
            meshfileName: 'school-01.gltf',
            referenceMeshToPosition: 0,
            position: new Vector3(145, 0, -200),
            referenceMeshToRotate: 0,
            rotation: new Vector3(0, 10, 0),
            shadowGenerator: shadowGenerator,
            enableCollision: true,
            showButton: true,
            attachButtonToMesh: 1,
            meshMetaData: {
                cameraTarget: new Vector3(145, 0, -200),
                cameraPosition: new Vector3(105, 0, -220)
            }
        }, this._camera, this._AdvancedDynamicTexture);

        Builder.buildMesh({
            name: 'Work Experience',
            meshFileUri: '/assets/3d/meshes/',
            meshfileName: 'company-01.gltf',
            referenceMeshToPosition: 0,
            position: new Vector3(-65, 0, -400),
            shadowGenerator: shadowGenerator,
            enableCollision: true,
            showButton: true,
            attachButtonToMesh: 1,
            meshMetaData: {
                cameraTarget: new Vector3(-65, 0, -400),
                cameraPosition: new Vector3(-25, 0, -350)
            }
        }, this._camera, this._AdvancedDynamicTexture);

        new Sound("sound-birds", `${ENV.assetsUrl}/assets/3d/audio/sound-birds.m4a`, this._scene, null, {
            loop: true,
            autoplay: true
        });

        ParticleGenerator.generateParticleSystem(rain, this._scene).start();
        ParticleGenerator.generateParticleSystem(snow, this._scene).start();
        ParticleGenerator.generateParticleSystem(hailstorm, this._scene).start();
        ParticleGenerator.generateParticleSystem(hailstormG, this._scene).start();
        ParticleGenerator.generateParticleSystem(autumn, this._scene).start();
        ParticleGenerator.generateParticleSystem(autumnG, this._scene).start();
        ParticleGenerator.generateParticleSystem(lightning, this._scene).start();
    }

    private doRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();

            if (this._camera.position.y < 2) this._camera.position.y = 2;
            if (this._camera.position.y > 10) this._camera.position.y = 10;
            if (this._camera.position.x > 550) this._camera.position.x = 550;
            if (this._camera.position.x < -550) this._camera.position.x = -550;
            if (this._camera.position.z > 60) this._camera.position.z = 60;
            if (this._camera.position.z < -550) this._camera.position.z = -550;
        });

        window.addEventListener('resize', () => {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
            this._engine.resize();
        });
    }
}