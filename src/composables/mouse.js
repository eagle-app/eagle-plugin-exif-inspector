import ContextMenu from "@imengyu/vue3-context-menu";

export function useContextMenu(items) {
    ContextMenu.showContextMenu({
        x: event.x,
        y: event.y,
        items: items
    });
}

export function useMouse() {
    const x = ref(0);
    const y = ref(0);

    function update(event) {
        x.value = event.x;
        y.value = event.y - 48;
    }

    onMounted(() => window.addEventListener("mousemove", update));
    onUnmounted(() => window.removeEventListener("mousemove", update));

    return { x, y };
}
