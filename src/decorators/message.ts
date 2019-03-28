export function Message(message_id: number, message_name: string) {
    return function (target: Function) {
        console.log('muh');
    }
}
