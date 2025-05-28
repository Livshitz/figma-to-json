export async function traverseLayers(
	layer: SceneNode,
	cb: (layer: SceneNode, parent: BaseNode | null) => void,
	parent: BaseNode | null = null
) {
	if (layer) {
		await cb(layer, parent);
	}
	if (hasChildren(layer)) {
		for (const child of layer.children) {
			await traverseLayers(child, cb, layer);
		}
	}
}

export const hasChildren = (node: unknown): node is ChildrenMixin =>
	!!(node && (node as any).children);

export const isGroupNode = (node: unknown): node is GroupNode =>
	!!(node && (node as any).type === "GROUP");

export const getLayout = (node: SceneNode) => {
	// Simple single layer group wrapping we can ignore
	if (isGroupNode(node) && node.children?.length === 1) {
		return "column";
	}

	if ((node as FrameNode).layoutMode === "VERTICAL") {
		return "column";
	}
	if ((node as FrameNode).layoutMode === "HORIZONTAL") {
		return "row";
	}
	return "unknown";
};

export const fastClone = <T extends any>(obj: T): T =>
	typeof obj === "symbol" ? null : JSON.parse(JSON.stringify(obj));

export function deepClone(obj: any, hash = new WeakMap()) {
	if (Object(obj) !== obj || obj instanceof Function || obj instanceof RegExp) {
		return obj; // Return primitives, functions, and regular expressions as is
	}

	if (hash.has(obj)) {
		return hash.get(obj); // If cyclic reference, return the cached version
	}

	const result: any = Array.isArray(obj) ? [] : {};

	hash.set(obj, result); // Cache the cloned object

	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			result[key] = deepClone(obj[key], hash); // Recursively clone nested objects
		}
	}

	return result;
}

class Helpers {
	// Helper function to check if an array is empty
	public isArrayEmpty(arr: any[]): boolean {
		return arr.length === 0;
	}

	// Helper function to check if an object is empty
	public isObjectEmpty(obj: Record<string, any>): boolean {
		return Object.keys(obj).length === 0;
	}

	// Helper function to check if a string is empty
	public isStringEmpty(str: string): boolean {
		return str.trim().length === 0;
	}

	// Helper function to check if a value is empty (generic)
	public isEmpty(value: any): boolean {
		if (value === null || value === undefined) return true;
		if (typeof value === 'string') return this.isStringEmpty(value);
		if (Array.isArray(value)) return this.isArrayEmpty(value);
		if (typeof value === 'object') return this.isObjectEmpty(value);
		return false;
	}

	public deleteProperties(obj, props) {
		props.forEach(prop => {
			delete obj[prop];
		});
		return obj;
	}

	public deletePropertiesRecursively(obj, props) {
		function deleteProps(obj) {
			props.forEach(prop => {
				delete obj[prop];
			});
	
			if (obj.children && Array.isArray(obj.children)) {
				obj.children.forEach(child => deleteProps(child));
			}
			
			return obj;
		}
	
		return deleteProps(obj);
	}

	public extractFieldsRecursively(arr, fields) {
		function extractFields(obj) {
			// Create a new object with only the specified fields
			const result = <any>{};
			fields.forEach(field => {
				if (obj.hasOwnProperty(field)) {
					result[field] = obj[field];
				}
			});
	
			// Recursively process children if they exist
			if (obj.children && Array.isArray(obj.children)) {
				result.children = obj.children.map(child => extractFields(child));
			}
	
			return result;
		}
	
		return arr.map(item => extractFields(item));
	}

	public clean(arr) {
		// Remove empty properties
		for (const obj of arr) {
			for (const key in obj) {
				const val = obj[key];
				if (helpers.isEmpty(val)) delete obj[key];
				// if (obj[key] === null || obj[key] === undefined || (Array.isArray(obj[key]) && obj[key].length === 0) || (typeof obj[key] === 'object' && Object.keys(obj[key]).length === 0)) {
				//     delete obj[key];
				// }
			}
		}
		return arr;
	}
}

export const helpers = new Helpers();