// import { helpers } from "libx.js/src/helpers";
import { convertIntoNodes } from "./altConversion";
import { helpers } from "./helpers";

function arrayBufferToBase64(buffer: Uint8Array): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let base64 = '', i, len = buffer.length, binary: any = '';

    for (i = 0; i < len; i += 3) {
        binary = (buffer[i] << 16) | (buffer[i + 1] << 8) | buffer[i + 2];
        base64 += chars[(binary >> 18) & 0x3F] + chars[(binary >> 12) & 0x3F] +
                  chars[(binary >> 6) & 0x3F] + chars[binary & 0x3F];
    }

    const pads = len % 3;
    if (pads > 0) {
        base64 = base64.slice(0, pads - 3);
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }
    }

    return base64;
}

async function traverseNode(node: any): Promise<any> {
    // console.log('node: ', libx.randomNumber());
    console.log('node: ', node);

    if (!node.visible) return null;

    let nodeData: any = {
        id: node.id,
        name: node.name,
        type: node.type,
        width: node.width,
        height: node.height,
        // x: node.x,
        // y: node.y,
        // visible: node.visible,
        // locked: node.locked,
        children: [],
    };

    // Handle absolute bounding box and transform
    // if ("absoluteBoundingBox" in node) {
    //     nodeData.absoluteBoundingBox = node.absoluteBoundingBox;
    // }
    // if ("absoluteRenderBounds" in node) {
    //     nodeData.absoluteRenderBounds = node.absoluteRenderBounds;
    // }
    // if ("absoluteTransform" in node) {
    //     nodeData.absoluteTransform = node.absoluteTransform;
    // }
    // if ("relativeTransform" in node) {
    //     nodeData.relativeTransform = node.relativeTransform;
    // }
    if ("rotation" in node) {
        nodeData.rotation = node.rotation;
    }

    // Handle constraints and layout
    if ("constraints" in node) {
        nodeData.constraints = node.constraints;
    }
    if ("layoutAlign" in node) {
        nodeData.layoutAlign = node.layoutAlign;
    }
    if ("layoutGrow" in node) {
        nodeData.layoutGrow = node.layoutGrow;
    }
    if ("layoutPositioning" in node) {
        nodeData.layoutPositioning = node.layoutPositioning;
    }
    if ("layoutSizingHorizontal" in node) {
        nodeData.layoutSizingHorizontal = node.layoutSizingHorizontal;
    }
    if ("layoutSizingVertical" in node) {
        nodeData.layoutSizingVertical = node.layoutSizingVertical;
    }

    // Handle fills
    if ("fills" in node && (<Paint[]>node.fills).length > 0) {
        nodeData.fills = await Promise.all((<Paint[]>node.fills).map(async (fill) => {
            if (fill.type === 'IMAGE' && fill.visible !== false) {
                // const imgBytes = await figma.getImageByHash(fill.imageHash).getBytesAsync();
                // const base64String = `data:image/png;base64,${arrayBufferToBase64(new Uint8Array(imgBytes))}`;
                // return { ...fill, base64: base64String };
                return { ...fill };
            } else {
                return fill;
            }
        }));
    }

    // Handle strokes
    if ("strokes" in node && node.strokes.length > 0) {
        nodeData.strokes = node.strokes;
        nodeData.strokeWeight = node.strokeWeight;
        nodeData.strokeAlign = node.strokeAlign;
        nodeData.strokeCap = node.strokeCap;
        nodeData.strokeJoin = node.strokeJoin;
        nodeData.strokeMiterLimit = node.strokeMiterLimit;
        nodeData.strokeBottomWeight = node.strokeBottomWeight;
        nodeData.strokeLeftWeight = node.strokeLeftWeight;
        nodeData.strokeRightWeight = node.strokeRightWeight;
        nodeData.strokeTopWeight = node.strokeTopWeight;
    }

    // Handle corner radius
    // Handle individual corner radii if they exist
    nodeData.borderRadius = {
        topLeft: node.topLeftRadius ?? 0,
        topRight: node.topRightRadius ?? 0,
        bottomRight: node.bottomRightRadius ?? 0,
        bottomLeft: node.bottomLeftRadius ?? 0
    };

    // Handle opacity and blend mode
    if ("opacity" in node) {
        nodeData.opacity = node.opacity;
    }

    if ("blendMode" in node) {
        nodeData.blendMode = node.blendMode;
    }

    // Handle effects
    if ("effects" in node && node.effects.length > 0) {
        nodeData.effects = node.effects.filter(effect => 
            ["DROP_SHADOW", "INNER_SHADOW", "LAYER_BLUR", "BACKGROUND_BLUR"].includes(effect.type)
        );
    }
    if ("effectStyleId" in node) {
        nodeData.effectStyleId = node.effectStyleId;
    }
    if ("fillStyleId" in node) {
        nodeData.fillStyleId = node.fillStyleId;
    }
    if ("strokeStyleId" in node) {
        nodeData.strokeStyleId = node.strokeStyleId;
    }
    // if ("fillGeometry" in node) {
    //     nodeData.fillGeometry = node.fillGeometry;
    // }

    // Handle additional properties
    if ("dashPattern" in node) {
        nodeData.dashPattern = node.dashPattern;
    }
    if ("cornerSmoothing" in node) {
        nodeData.cornerSmoothing = node.cornerSmoothing;
    }
    if ("maskType" in node) {
        nodeData.maskType = node.maskType;
    }
    if ("exportSettings" in node) {
        nodeData.exportSettings = node.exportSettings;
    }
    if ("isAsset" in node) {
        nodeData.isAsset = node.isAsset;
    }
    if ("isMask" in node) {
        nodeData.isMask = node.isMask;
    }
    if ("minWidth" in node) {
        nodeData.minWidth = node.minWidth;
    }
    if ("minHeight" in node) {
        nodeData.minHeight = node.minHeight;
    }
    if ("maxWidth" in node) {
        nodeData.maxWidth = node.maxWidth;
    }
    if ("maxHeight" in node) {
        nodeData.maxHeight = node.maxHeight;
    }
    if ("stuckNodes" in node) {
        nodeData.stuckNodes = node.stuckNodes;
    }
    
    // Handle text properties
    if (node.type === "TEXT") {
        nodeData.fontSize = node.fontSize;
        nodeData.fontName = node.fontName;
        nodeData.textAlignHorizontal = node.textAlignHorizontal;
        nodeData.textAlignVertical = node.textAlignVertical;
        nodeData.characters = node.characters;
        if ("lineHeight" in node) {
            nodeData.lineHeight = node.lineHeight;
        }
        if ("letterSpacing" in node) {
            nodeData.letterSpacing = node.letterSpacing;
        }
    }
	
	// Recursively handle children if they exist
	if ("children" in node && node.children.length > 0) {
        nodeData.children = await Promise.all(node.children.map(traverseNode));
    }

    // Remove empty properties
    for (const key in nodeData) {
        if (nodeData[key] === null || nodeData[key] === undefined || (Array.isArray(nodeData[key]) && nodeData[key].length === 0) || (typeof nodeData[key] === 'object' && Object.keys(nodeData[key]).length === 0)) {
            delete nodeData[key];
        }
    }

	return nodeData;
}

figma.codegen.on('generate', async ({ language, node }) => {
	// const selection = figma.currentPage.selection;
	// if (selection.length == 0) return [];
	// const node = selection[0];

    // console.log('test: ', helpers.randomNumber());
	debugger;
    let obj = await convertIntoNodes([node], null);
    // obj = helpers.clean(obj);
	const json = JSON.stringify(obj, null, 2);
	// const json = JSON.stringify(await traverseNode(selection[0]), null, 2);
	
	console.log('DBG: Generate');

	const code = `{
		name: "${node.name}"
	}`;
	return [
		{
			language: "PLAINTEXT",
			code: json,
			title: "Codegen Plugin 9",
		},
	];
});