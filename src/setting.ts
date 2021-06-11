// eslint-disable-next-line max-len
declare function get( $id?: string | number, $key?: string ): string | Record<string, unknown> | undefined;
declare function set( $id: string | number, $key: string, $value: unknown ): boolean;
declare function remove( $id: string | number, $key: string ): boolean;
declare function updateusingtime( $timestamp: number, $id?: string | number ): boolean;

export = {
	get,
	set,
	remove,
	updateusingtime
};
