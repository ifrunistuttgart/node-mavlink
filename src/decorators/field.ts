export function Message(message_id: number) {
    return function (target: Function) {
        console.log('muh');
    }
}
