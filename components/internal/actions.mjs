export function tooltip(element, tooltip = '') {
    const popover = RED.popover.tooltip(window.$(element), tooltip);

    return {
        update(tooltip) {
            popover.setContent(tooltip);
        },
        destroy() {
            popover.delete();
        }
    };
}

export function menu(element, options) {
    let opt = {
        ...options,
        options: options.options.map((v) => (typeof v === 'string' ? { label: v, value: v } : v))
    };

    let menu = undefined;

    function openMenu() {
        menu = RED.popover.menu({
            onselect: (selected) => opt.onselect?.(selected.value, element),
            onclose: (value) => {
                menu = undefined;
                opt.onclose?.(value, element);
            },
            width: opt.width,
            maxHeight: opt.maxHeight,
            style: opt.style,
            options: opt.options,
            disposeOnClose: true
        });
        menu.show({
            target: window.$(element),
            align: opt.align,
            offset: opt.offset
        });
    }

    if (options.show) {
        openMenu();
    }

    return {
        update(options) {
            opt = {
                ...options,
                options: options.options.map((v) =>
                    typeof v === 'string'
                        ? { label: v, value: v }
                        : { ...v, onselect: (v) => opt.onselect?.(element) }
                )
            };

            if (menu) {
                if (!opt.show) {
                    menu.hide();
                    menu = undefined;
                    return;
                }
                menu.options(opt.options);
            } else {
                if (!opt.show) return;
                openMenu();
            }
        },
        destroy() {
            menu?.hide();
            menu = undefined;
        }
    };
}
