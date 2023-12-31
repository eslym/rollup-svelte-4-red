import { EditorNodeInstance } from 'node-red';
import { SvelteComponent, ComponentType, ComponentConstructorOptions } from 'svelte';
import { Writable } from 'svelte/store';

type Awaitable<T> = T | Promise<T>;

export type IconSource = { fa4: FronAwesome4Icons };

export interface MenuOptions {
    show?: boolean;
    options: (
        | {
              label: string;
              value: any;
              onselect: (target: HTMLElement) => void;
          }
        | string
    )[];
    style?: 'compact';
    maxHeight?: string;
    width?: string;
    align?: 'left' | 'right';
    offset?: [number, number];
    onclose?: (cancelled: boolean, target: HTMLElement) => void;
    onselect?: (value: any, target: HTMLElement) => void;
}

export interface SelectOption {
    component?: ComponentType;
    label?: string;
    icon?: IconSource;
    selected?: boolean;
    value: string;
}

export interface TypedInputSelectOption extends SelectOption {
    component?: ComponentType;
    icon?: IconSource;
    label: string;
    value: string;
}

export type AutoCompleteSuggestion<C extends ComponentType = never> = C extends never
    ?
          | {
                value: string;
                source?: string[];
            }
          | string
    : {
          component: C;
          value: string;
          [key: string]: any;
      };

export interface TypeDefinition {
    label: string;
    icon?: IconSource;
    hasValue?: boolean;
    options?: (TypedInputSelectOption | string)[];
    viewLabel?: ComponentType;
    validate?: (value: string) => boolean;
    expand?: (value: string, update: (val: string) => void) => void;
    suggestions?:
        | AutoCompleteSuggestion[]
        | ((value: string) => Awaitable<AutoCompleteSuggestion[]>);
}

export class Row extends SvelteComponent<
    {
        class?: string | Record<string, boolean>;
    },
    {},
    {
        default: {};
    }
> {}

export class Input extends SvelteComponent<
    {
        prop?: string;
        icon?: IconSource;
        label?: string;
        placeholder?: string;
        type?: string;
        config?: string;
        value?: string | boolean | number;
        inline?: boolean;
        disabled?: boolean;
        required?: boolean;
        novalidate?: boolean;
        class?: string | Record<string, boolean>;
    },
    {
        change: Event;
        click: MouseEvent;
        keydown: KeyboardEvent;
        keyup: KeyboardEvent;
        blur: FocusEvent;
        focus: FocusEvent;
        input: Event;
    },
    {
        default: {};
    }
> {}

export class AutoComplete extends SvelteComponent<
    {
        prop?: string;
        icon?: IconSource;
        label?: string;
        placeholder?: string;
        value?: string;
        inline?: boolean;
        disabled?: boolean;
        required?: boolean;
        novalidate?: boolean;
        class?: string | Record<string, boolean>;
        suggestions?:
            | AutoCompleteSuggestion[]
            | ((value: string) => Awaitable<AutoCompleteSuggestion[]>);
    },
    {
        change: Event;
        click: MouseEvent;
        keydown: CustomEvent<KeyboardEvent>;
        keyup: KeyboardEvent;
        focus: CustomEvent;
        blur: CustomEvent;
        input: Event;
    },
    {}
> {}

export class TypedInput extends SvelteComponent<
    {
        prop?: string;
        icon?: IconSource;
        label?: string;
        placeholder?: string;
        value?: {
            type: string;
            value: string;
        };
        inline?: boolean;
        disabled?: boolean;
        required?: boolean;
        novalidate?: boolean;
        types?: Record<string, TypeDefinition | true> | BuiltInTypes[];
    },
    {
        change: Event;
        blur: CustomEvent;
        focus: CustomEvent;
        typechange: CustomEvent<{ old: string; new: string }>;
    },
    {}
> {
    static builtinTypes: Record<BuiltInTypes, TypeDefinition>;
    static validator(prop: string): (this: EditorNodeInstance, value: any) => boolean;
    static validator(
        types: Record<string, TypeDefinition | true> | BuiltInTypes[]
    ): (value: any) => boolean;
}

export class Icon extends SvelteComponent<
    {
        icon: IconSource;
        class?: string | Record<string, boolean>;
    },
    {}
> {}

/**
 * Wrapper for RED.popover.tooltip
 * @param element target element
 * @param tooltip tooltip text
 */
export function tooltip(element: HTMLElement, tooltip: string): { destroy(): void };

/**
 * Wrapper for RED.popover.menu
 * @param element target element
 * @param options menu options
 */
export function menu(element: HTMLElement, options: MenuOptions): { destroy(): void };

/**
 * Wrapper for ResizeObserver
 * @param element target element
 * @param callback callback function
 */
export function onresize(
    element: HTMLElement,
    callback: (entry: ResizeObserverEntry) => void
): { update(callback: (entry: ResizeObserverEntry) => void): void; destroy(): void };

type IntersecActionOptions = (entry: IntersectionObserverEntry) =>
    | void
    | (IntersectionObserverInit & {
          callback: (entry: IntersectionObserverEntry) => void;
      });

/**
 * Wrapper for IntersectionObserver
 * @param element target element
 * @param options options
 */
export function onintersect(
    element: HTMLElement,
    options: IntersecActionOptions
): {
    update(options: IntersecActionOptions): void;
    destroy(): void;
};

interface SelectionActionOptions {
    focus?: Writable<() => void>;

    shown?: Writable<boolean>;

    /**
     * Recommended to passthrough the value of `getContext()` from component
     */
    context?: Map<any, any>;

    options?: Writable<(SelectOption | string)[]>;

    onSelect?: (selected: SelectOption) => void;

    component?: ComponentType;

    class?: string | Record<string, boolean>;
}

export function selection(
    element: HTMLElement,
    options: SelectionActionOptions
): { update(options: SelectionActionOptions): void; destroy(): void };

export interface OpenTrayOptions<T extends Record<string, any> | undefined> {
    props?: T;
    binding?: {
        [K in keyof T]?: (value: T[K]) => void;
    };
    context?: Map<any, any>;
    on?: Record<string, (event: CustomEvent) => void>;
    title?: string;
    width?: string | number;
    maximized?: boolean;
    buttons?: {
        id?: string;
        text: string;
        class?: string;
        click?: () => void;
    }[];
    show?: () => void;
}

type ComponentProps<C extends ComponentType> = C extends {
    new (options: infer O extends ComponentConstructorOptions): any;
}
    ? O['props']
    : never;

export function openTray<C extends ComponentType>(
    component: C,
    options: OpenTrayOptions<ComponentProps<C>>
): void;

export function openTypeEditor<C extends ComponentType>(
    component: C,
    options: OpenTrayOptions<ComponentProps<C>>
): void;

type FronAwesome4Icons = [
    'address-book',
    'address-book-o',
    'address-card',
    'address-card-o',
    'bandcamp',
    'bath',
    'bathtub',
    'drivers-license',
    'drivers-license-o',
    'eercast',
    'envelope-open',
    'envelope-open-o',
    'etsy',
    'free-code-camp',
    'grav',
    'handshake-o',
    'id-badge',
    'id-card',
    'id-card-o',
    'imdb',
    'linode',
    'meetup',
    'microchip',
    'podcast',
    'quora',
    'ravelry',
    's15',
    'shower',
    'snowflake-o',
    'superpowers',
    'telegram',
    'thermometer',
    'thermometer-0',
    'thermometer-1',
    'thermometer-2',
    'thermometer-3',
    'thermometer-4',
    'thermometer-empty',
    'thermometer-full',
    'thermometer-half',
    'thermometer-quarter',
    'thermometer-three-quarters',
    'times-rectangle',
    'times-rectangle-o',
    'user-circle',
    'user-circle-o',
    'user-o',
    'vcard',
    'vcard-o',
    'window-close',
    'window-close-o',
    'window-maximize',
    'window-minimize',
    'window-restore',
    'wpexplorer',
    'adjust',
    'american-sign-language-interpreting',
    'anchor',
    'archive',
    'area-chart',
    'arrows',
    'arrows-h',
    'arrows-v',
    'asl-interpreting',
    'assistive-listening-systems',
    'asterisk',
    'at',
    'audio-description',
    'automobile',
    'balance-scale',
    'ban',
    'bank',
    'bar-chart',
    'bar-chart-o',
    'barcode',
    'bars',
    'battery',
    'battery-0',
    'battery-1',
    'battery-2',
    'battery-3',
    'battery-4',
    'battery-empty',
    'battery-full',
    'battery-half',
    'battery-quarter',
    'battery-three-quarters',
    'bed',
    'beer',
    'bell',
    'bell-o',
    'bell-slash',
    'bell-slash-o',
    'bicycle',
    'binoculars',
    'birthday-cake',
    'blind',
    'bluetooth',
    'bluetooth-b',
    'bolt',
    'bomb',
    'book',
    'bookmark',
    'bookmark-o',
    'braille',
    'briefcase',
    'bug',
    'building',
    'building-o',
    'bullhorn',
    'bullseye',
    'bus',
    'cab',
    'calculator',
    'calendar',
    'calendar-check-o',
    'calendar-minus-o',
    'calendar-o',
    'calendar-plus-o',
    'calendar-times-o',
    'camera',
    'camera-retro',
    'car',
    'caret-square-o-down',
    'caret-square-o-left',
    'caret-square-o-right',
    'caret-square-o-up',
    'cart-arrow-down',
    'cart-plus',
    'cc',
    'certificate',
    'check',
    'check-circle',
    'check-circle-o',
    'check-square',
    'check-square-o',
    'child',
    'circle',
    'circle-o',
    'circle-o-notch',
    'circle-thin',
    'clock-o',
    'clone',
    'close',
    'cloud',
    'cloud-download',
    'cloud-upload',
    'code',
    'code-fork',
    'coffee',
    'cog',
    'cogs',
    'comment',
    'comment-o',
    'commenting',
    'commenting-o',
    'comments',
    'comments-o',
    'compass',
    'copyright',
    'creative-commons',
    'credit-card',
    'credit-card-alt',
    'crop',
    'crosshairs',
    'cube',
    'cubes',
    'cutlery',
    'dashboard',
    'database',
    'deaf',
    'deafness',
    'desktop',
    'diamond',
    'dot-circle-o',
    'download',
    'edit',
    'ellipsis-h',
    'ellipsis-v',
    'envelope',
    'envelope-o',
    'envelope-square',
    'eraser',
    'exchange',
    'exclamation',
    'exclamation-circle',
    'exclamation-triangle',
    'external-link',
    'external-link-square',
    'eye',
    'eye-slash',
    'eyedropper',
    'fax',
    'feed',
    'female',
    'fighter-jet',
    'file-archive-o',
    'file-audio-o',
    'file-code-o',
    'file-excel-o',
    'file-image-o',
    'file-movie-o',
    'file-pdf-o',
    'file-photo-o',
    'file-picture-o',
    'file-powerpoint-o',
    'file-sound-o',
    'file-video-o',
    'file-word-o',
    'file-zip-o',
    'film',
    'filter',
    'fire',
    'fire-extinguisher',
    'flag',
    'flag-checkered',
    'flag-o',
    'flash',
    'flask',
    'folder',
    'folder-o',
    'folder-open',
    'folder-open-o',
    'frown-o',
    'futbol-o',
    'gamepad',
    'gavel',
    'gear',
    'gears',
    'gift',
    'glass',
    'globe',
    'graduation-cap',
    'group',
    'hand-grab-o',
    'hand-lizard-o',
    'hand-paper-o',
    'hand-peace-o',
    'hand-pointer-o',
    'hand-rock-o',
    'hand-scissors-o',
    'hand-spock-o',
    'hand-stop-o',
    'hard-of-hearing',
    'hashtag',
    'hdd-o',
    'headphones',
    'heart',
    'heart-o',
    'heartbeat',
    'history',
    'home',
    'hotel',
    'hourglass',
    'hourglass-1',
    'hourglass-2',
    'hourglass-3',
    'hourglass-end',
    'hourglass-half',
    'hourglass-o',
    'hourglass-start',
    'i-cursor',
    'image',
    'inbox',
    'industry',
    'info',
    'info-circle',
    'institution',
    'key',
    'keyboard-o',
    'language',
    'laptop',
    'leaf',
    'legal',
    'lemon-o',
    'level-down',
    'level-up',
    'life-bouy',
    'life-buoy',
    'life-ring',
    'life-saver',
    'lightbulb-o',
    'line-chart',
    'location-arrow',
    'lock',
    'low-vision',
    'magic',
    'magnet',
    'mail-forward',
    'mail-reply',
    'mail-reply-all',
    'male',
    'map',
    'map-marker',
    'map-o',
    'map-pin',
    'map-signs',
    'meh-o',
    'microphone',
    'microphone-slash',
    'minus',
    'minus-circle',
    'minus-square',
    'minus-square-o',
    'mobile',
    'mobile-phone',
    'money',
    'moon-o',
    'mortar-board',
    'motorcycle',
    'mouse-pointer',
    'music',
    'navicon',
    'newspaper-o',
    'object-group',
    'object-ungroup',
    'paint-brush',
    'paper-plane',
    'paper-plane-o',
    'paw',
    'pencil',
    'pencil-square',
    'pencil-square-o',
    'percent',
    'phone',
    'phone-square',
    'photo',
    'picture-o',
    'pie-chart',
    'plane',
    'plug',
    'plus',
    'plus-circle',
    'plus-square',
    'plus-square-o',
    'power-off',
    'print',
    'puzzle-piece',
    'qrcode',
    'question',
    'question-circle',
    'question-circle-o',
    'quote-left',
    'quote-right',
    'random',
    'recycle',
    'refresh',
    'registered',
    'remove',
    'reorder',
    'reply',
    'reply-all',
    'retweet',
    'road',
    'rocket',
    'rss',
    'rss-square',
    'search',
    'search-minus',
    'search-plus',
    'send',
    'send-o',
    'server',
    'share',
    'share-alt',
    'share-alt-square',
    'share-square',
    'share-square-o',
    'shield',
    'ship',
    'shopping-bag',
    'shopping-basket',
    'shopping-cart',
    'sign-in',
    'sign-language',
    'sign-out',
    'signal',
    'signing',
    'sitemap',
    'sliders',
    'smile-o',
    'soccer-ball-o',
    'sort',
    'sort-alpha-asc',
    'sort-alpha-desc',
    'sort-amount-asc',
    'sort-amount-desc',
    'sort-asc',
    'sort-desc',
    'sort-down',
    'sort-numeric-asc',
    'sort-numeric-desc',
    'sort-up',
    'space-shuttle',
    'spinner',
    'spoon',
    'square',
    'square-o',
    'star',
    'star-half',
    'star-half-empty',
    'star-half-full',
    'star-half-o',
    'star-o',
    'sticky-note',
    'sticky-note-o',
    'street-view',
    'suitcase',
    'sun-o',
    'support',
    'tablet',
    'tachometer',
    'tag',
    'tags',
    'tasks',
    'taxi',
    'television',
    'terminal',
    'thumb-tack',
    'thumbs-down',
    'thumbs-o-down',
    'thumbs-o-up',
    'thumbs-up',
    'ticket',
    'times',
    'times-circle',
    'times-circle-o',
    'tint',
    'toggle-down',
    'toggle-left',
    'toggle-off',
    'toggle-on',
    'toggle-right',
    'toggle-up',
    'trademark',
    'trash',
    'trash-o',
    'tree',
    'trophy',
    'truck',
    'tty',
    'tv',
    'umbrella',
    'universal-access',
    'university',
    'unlock',
    'unlock-alt',
    'unsorted',
    'upload',
    'user',
    'user-plus',
    'user-secret',
    'user-times',
    'users',
    'video-camera',
    'volume-control-phone',
    'volume-down',
    'volume-off',
    'volume-up',
    'warning',
    'wheelchair',
    'wheelchair-alt',
    'wifi',
    'wrench',
    'hand-o-down',
    'hand-o-left',
    'hand-o-right',
    'hand-o-up',
    'ambulance',
    'subway',
    'train',
    'genderless',
    'intersex',
    'mars',
    'mars-double',
    'mars-stroke',
    'mars-stroke-h',
    'mars-stroke-v',
    'mercury',
    'neuter',
    'transgender',
    'transgender-alt',
    'venus',
    'venus-double',
    'venus-mars',
    'file',
    'file-o',
    'file-text',
    'file-text-o',
    'cc-amex',
    'cc-diners-club',
    'cc-discover',
    'cc-jcb',
    'cc-mastercard',
    'cc-paypal',
    'cc-stripe',
    'cc-visa',
    'google-wallet',
    'paypal',
    'bitcoin',
    'btc',
    'cny',
    'dollar',
    'eur',
    'euro',
    'gbp',
    'gg',
    'gg-circle',
    'ils',
    'inr',
    'jpy',
    'krw',
    'rmb',
    'rouble',
    'rub',
    'ruble',
    'rupee',
    'shekel',
    'sheqel',
    'try',
    'turkish-lira',
    'usd',
    'viacoin',
    'won',
    'yen',
    'align-center',
    'align-justify',
    'align-left',
    'align-right',
    'bold',
    'chain',
    'chain-broken',
    'clipboard',
    'columns',
    'copy',
    'cut',
    'dedent',
    'files-o',
    'floppy-o',
    'font',
    'header',
    'indent',
    'italic',
    'link',
    'list',
    'list-alt',
    'list-ol',
    'list-ul',
    'outdent',
    'paperclip',
    'paragraph',
    'paste',
    'repeat',
    'rotate-left',
    'rotate-right',
    'save',
    'scissors',
    'strikethrough',
    'subscript',
    'superscript',
    'table',
    'text-height',
    'text-width',
    'th',
    'th-large',
    'th-list',
    'underline',
    'undo',
    'unlink',
    'angle-double-down',
    'angle-double-left',
    'angle-double-right',
    'angle-double-up',
    'angle-down',
    'angle-left',
    'angle-right',
    'angle-up',
    'arrow-circle-down',
    'arrow-circle-left',
    'arrow-circle-o-down',
    'arrow-circle-o-left',
    'arrow-circle-o-right',
    'arrow-circle-o-up',
    'arrow-circle-right',
    'arrow-circle-up',
    'arrow-down',
    'arrow-left',
    'arrow-right',
    'arrow-up',
    'arrows-alt',
    'caret-down',
    'caret-left',
    'caret-right',
    'caret-up',
    'chevron-circle-down',
    'chevron-circle-left',
    'chevron-circle-right',
    'chevron-circle-up',
    'chevron-down',
    'chevron-left',
    'chevron-right',
    'chevron-up',
    'long-arrow-down',
    'long-arrow-left',
    'long-arrow-right',
    'long-arrow-up',
    'backward',
    'compress',
    'eject',
    'expand',
    'fast-backward',
    'fast-forward',
    'forward',
    'pause',
    'pause-circle',
    'pause-circle-o',
    'play',
    'play-circle',
    'play-circle-o',
    'step-backward',
    'step-forward',
    'stop',
    'stop-circle',
    'stop-circle-o',
    'youtube-play',
    '500px',
    'adn',
    'amazon',
    'android',
    'angellist',
    'apple',
    'behance',
    'behance-square',
    'bitbucket',
    'bitbucket-square',
    'black-tie',
    'buysellads',
    'chrome',
    'codepen',
    'codiepie',
    'connectdevelop',
    'contao',
    'css3',
    'dashcube',
    'delicious',
    'deviantart',
    'digg',
    'dribbble',
    'dropbox',
    'drupal',
    'edge',
    'empire',
    'envira',
    'expeditedssl',
    'fa',
    'facebook',
    'facebook-f',
    'facebook-official',
    'facebook-square',
    'firefox',
    'first-order',
    'flickr',
    'font-awesome',
    'fonticons',
    'fort-awesome',
    'forumbee',
    'foursquare',
    'ge',
    'get-pocket',
    'git',
    'git-square',
    'github',
    'github-alt',
    'github-square',
    'gitlab',
    'gittip',
    'glide',
    'glide-g',
    'google',
    'google-plus',
    'google-plus-circle',
    'google-plus-official',
    'google-plus-square',
    'gratipay',
    'hacker-news',
    'houzz',
    'html5',
    'instagram',
    'internet-explorer',
    'ioxhost',
    'joomla',
    'jsfiddle',
    'lastfm',
    'lastfm-square',
    'leanpub',
    'linkedin',
    'linkedin-square',
    'linux',
    'maxcdn',
    'meanpath',
    'medium',
    'mixcloud',
    'modx',
    'odnoklassniki',
    'odnoklassniki-square',
    'opencart',
    'openid',
    'opera',
    'optin-monster',
    'pagelines',
    'pied-piper',
    'pied-piper-alt',
    'pied-piper-pp',
    'pinterest',
    'pinterest-p',
    'pinterest-square',
    'product-hunt',
    'qq',
    'ra',
    'rebel',
    'reddit',
    'reddit-alien',
    'reddit-square',
    'renren',
    'resistance',
    'safari',
    'scribd',
    'sellsy',
    'shirtsinbulk',
    'simplybuilt',
    'skyatlas',
    'skype',
    'slack',
    'slideshare',
    'snapchat',
    'snapchat-ghost',
    'snapchat-square',
    'soundcloud',
    'spotify',
    'stack-exchange',
    'stack-overflow',
    'steam',
    'steam-square',
    'stumbleupon',
    'stumbleupon-circle',
    'tencent-weibo',
    'themeisle',
    'trello',
    'tripadvisor',
    'tumblr',
    'tumblr-square',
    'twitch',
    'twitter',
    'twitter-square',
    'usb',
    'viadeo',
    'viadeo-square',
    'vimeo',
    'vimeo-square',
    'vine',
    'vk',
    'wechat',
    'weibo',
    'weixin',
    'whatsapp',
    'wikipedia-w',
    'windows',
    'wordpress',
    'wpbeginner',
    'wpforms',
    'xing',
    'xing-square',
    'y-combinator',
    'y-combinator-square',
    'yahoo',
    'yc',
    'yc-square',
    'yelp',
    'yoast',
    'youtube',
    'youtube-square',
    'h-square',
    'hospital-o',
    'medkit',
    'stethoscope',
    'user-md'
][number];

type BuiltInTypes = [
    'str',
    'msg',
    'flow',
    'global',
    'env',
    'num',
    'bool',
    'json',
    're',
    'date',
    'jsonata',
    'bin',
    'node',
    'undefined'
][number];
