export interface APIErrorResponse {
	status: 'failure';
	error: string;
	message: string;
}

export interface APIResource<T extends object = Record<string, any>> {
	data: T & { id?: string };
	relations: Record<string, string> | null;
	updates: Record<string, { queue: string; mount: string }> | null;
}

export type APIResourceStatusError = {
	status: 'failure';
	error: string;
	message: string;
};

export type APIResourceStatusMeta = [];

export interface APIResourceStatus {
	status: number;
	headers: Record<string, string>;
	meta: Array<unknown>;
}

export interface APISuccessResponse<T extends object = Record<string, any>> {
	status: 'success';
	id: string;
	denormalized: Record<string, APIResource<T>>;
	http: Record<string, APIResourceStatus>;
}

export type APIResponse<T extends object = Record<string, any>> =
	| APIErrorResponse
	| APISuccessResponse<T>;

export type DateMapped<T extends Record<string, any>> = {
	[K in keyof T]: K extends `${infer N}_datetime`
		? Date
		: T[K] extends object
		? DateMapped<T[K]>
		: T[K];
};
