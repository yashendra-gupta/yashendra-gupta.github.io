import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Scene } from "@babylonjs/core/scene";
import { Util } from "../util";

class Vector3Wrap {
    x: number;
    y: number;
    z: number;
}

class color3Wrap {
    r: number;
    g: number;
    b: number;
}

class color4Wrap {
    r: number;
    g: number;
    b: number;
    a: number;
}


enum EmitterType {
    BOX,
    CONE,
    SPHERE
}

class EmitterOptions {
    // For box emitter 
    direction1: Vector3Wrap;
    direction2: Vector3Wrap;
    minEmitBox: Vector3Wrap;
    maxEmitBox: Vector3Wrap;
}

enum blendModeWrap {
    ONEONE,
    STANDARD
}

class particleSystemConfiguration {
    renderingGroupId?: number;
    name: string;
    position: Vector3Wrap;
    rotationZ?: number;
    capacity: number;
    emitterType: EmitterType;
    emitterOptions: EmitterOptions
    particleTextureUrl: string;
    blendMode: blendModeWrap;
    minLifeTime: number;
    maxLifeTime: number;
    emitRate: number;
    color1?: color4Wrap;
    color2?: color4Wrap;
    colorDead?: color4Wrap;
    minSize?: number;
    maxSize?: number;
    gravity?: Vector3Wrap;
    minAngularSpeed?: number;
    maxAngularSpeed?: number;
    isLocal: boolean;
}

export class ParticleGenerator {

    public static generateParticleSystem(particleSystemConfiguration: particleSystemConfiguration, scene: Scene) {
        const renderingGroupId = !Util.isNullOrUndefined(particleSystemConfiguration.renderingGroupId) ? particleSystemConfiguration.renderingGroupId : 2;
        const position = particleSystemConfiguration.position;

        const particleSystemSource = MeshBuilder.CreateBox(`source-${particleSystemConfiguration.name}`, { size: 1 }, scene);
        particleSystemSource.position = new Vector3(position.x, position.y, position.z);
        
        if (!Util.isNullOrUndefined(particleSystemConfiguration.rotationZ)) {
            particleSystemSource.rotation.z = particleSystemConfiguration.rotationZ;
        }

        particleSystemSource.renderingGroupId = renderingGroupId;
        particleSystemSource.visibility = 0;

        const particleSystem = new ParticleSystem(`particles-${particleSystemConfiguration.name}`, particleSystemConfiguration.capacity, scene);
        particleSystem.emitter = particleSystemSource;

        const emitterOptions = particleSystemConfiguration.emitterOptions;

        if (particleSystemConfiguration.emitterType === EmitterType.BOX) {
            particleSystem.createBoxEmitter(
                new Vector3(
                    emitterOptions.direction1.x,
                    emitterOptions.direction1.y,
                    emitterOptions.direction1.z,
                ),
                new Vector3(
                    emitterOptions.direction2.x,
                    emitterOptions.direction2.y,
                    emitterOptions.direction2.z,
                ),
                new Vector3(
                    emitterOptions.minEmitBox.x,
                    emitterOptions.minEmitBox.y,
                    emitterOptions.minEmitBox.z,
                ),
                new Vector3(
                    emitterOptions.maxEmitBox.x,
                    emitterOptions.maxEmitBox.y,
                    emitterOptions.maxEmitBox.z,
                )
            );
        }

        particleSystem.particleTexture = new Texture(particleSystemConfiguration.particleTextureUrl, scene);
        particleSystem.renderingGroupId = renderingGroupId;
        particleSystem.minLifeTime = particleSystemConfiguration.maxLifeTime;
        particleSystem.maxLifeTime = particleSystemConfiguration.maxLifeTime;
        particleSystem.emitRate = particleSystemConfiguration.emitRate;

        if (particleSystemConfiguration.blendMode === blendModeWrap.ONEONE) {
            particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
        }

        if (!Util.isNullOrUndefined(particleSystemConfiguration.color1)) {
            particleSystem.color1 = new Color4(
                particleSystemConfiguration.color1.r,
                particleSystemConfiguration.color1.g,
                particleSystemConfiguration.color1.g,
                particleSystemConfiguration.color1.b

            );
        }

        if (!Util.isNullOrUndefined(particleSystemConfiguration.color2)) {

            particleSystem.color2 = new Color4(
                particleSystemConfiguration.color2.r,
                particleSystemConfiguration.color2.g,
                particleSystemConfiguration.color2.g,
                particleSystemConfiguration.color2.b

            );
        }

        if (!Util.isNullOrUndefined(particleSystemConfiguration.colorDead)) {
            particleSystem.colorDead = new Color4(
                particleSystemConfiguration.colorDead.r,
                particleSystemConfiguration.colorDead.g,
                particleSystemConfiguration.colorDead.g,
                particleSystemConfiguration.colorDead.b

            );
        }

        if (!Util.isNullOrUndefined(particleSystemConfiguration.minSize)) {
            particleSystem.minSize = particleSystemConfiguration.minSize;
        }

        if (!Util.isNullOrUndefined(particleSystemConfiguration.maxSize)) {
            particleSystem.maxSize = particleSystemConfiguration.maxSize;
        }

        if (!Util.isNullOrUndefined(particleSystemConfiguration.gravity)) {
            particleSystem.gravity = new Vector3(
                particleSystemConfiguration.gravity.x,
                particleSystemConfiguration.gravity.y,
                particleSystemConfiguration.gravity.z
            );
        }

        particleSystem.updateSpeed = 0.005;
        particleSystem.isLocal = particleSystemConfiguration.isLocal;

        return particleSystem;
    }
}