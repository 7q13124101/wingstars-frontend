export const PAGE_NAME = {
    LOGIN_PAGE: 'login_page',
    DASHBOARD_PAGE: 'dashboard_page',
    NOT_FOUND_PAGE: 'not_found_page',
    FORBIDDEN_PAGE: 'forbidden_page',
} as const;
export type PAGE_NAME = (typeof PAGE_NAME)[keyof typeof PAGE_NAME];

export const SUPPORT_LANGUAGE = {
    EN: 'en',
    VI: 'vi',
    TW: 'tw',
} as const;
export type SUPPORT_LANGUAGE = (typeof SUPPORT_LANGUAGE)[keyof typeof SUPPORT_LANGUAGE];

export const DEFAULT_LANGUAGE = SUPPORT_LANGUAGE.EN;

export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    GROUP_HAS_CHILDREN: 410,
    GROUP_MAX_LEVEL: 411,
    GROUP_MAX_QUANTITY: 412,
    ITEM_NOT_FOUND: 444,
    ITEM_ALREADY_EXIST: 445,
    ITEM_INVALID: 446,
    NETWORK_ERROR: 447,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;
export type HTTP_STATUS = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export const DATE_TIME_FORMAT = {
    YYYY_MM_DD_HYPHEN: 'YYYY-MM-DD',
    DD_MM_YYYY_DASH: 'DD/MM/YYYY',
    DD_MM_YYYY_HYPHEN: 'DD-MM-YYYY',
    YYYY_MM_DD_DASH: 'YYYY/MM/DD',
    hh_mm_L_COLON: 'h:mm L',
    hh_mm_vi_DD_MM_YYYY_DOT: 'hh:mm [Ngày] DD.MM.YYYY',
    dddd_vi_DD_MM_YYYY_DASH: 'dddd [Ngày] DD/MM/YYYY',
    DD_MM_YY_DASH: 'DD/MM/YYYY',
    dddd_vi_L_SPACE: 'dddd, [ngày] L',
    DD_vi_MM: 'DD [Th]MM',
    DD_vi_M_YYYY: 'DD [Th]M YYYY',
    hh_mm: 'hh:mm',
    YYYY_MM_DD_HH_MM_SS_HYPHEN: 'YYYY-MM-DD HH:mm:ss',
    hh_mm_A: 'hh:mm A',
    h_A: 'h A',
    h_mm_A: 'h:mm A',
    HH_mm: 'HH:mm',
    MMMM_YYYY: 'MMMM, YYYY',

} as const;
export type DATE_TIME_FORMAT = (typeof DATE_TIME_FORMAT)[keyof typeof DATE_TIME_FORMAT];

export const FORM_VALIDATION = {
    textMinLength: 3,
    textMaxLength: 255,
    nameMaxLength: 64,
    codeMaxLength: 10,
    textAreaMaxLength: 2000,
    passwordMinLength: 8,
    numberRegExp: /^[0-9]+$/,
    phoneRegExp: /^(((\+)84)|0)(3|5|7|8|9)([0-9]{3,13})/,
    nameRegExp: /^([^!@`~#$:%^*&().<>?\\/\\+|=]+?)$/,
    specialCharacters: /[~`!@#$%^&*()+={}[\];:'"<>.,/\\?-_]/g,
    codeRegExp: /^(([^~`!@#$%^&*()+={}[\];:'"<>.,/\\?-_\s]|[A-Z])+?)$/g, //does not match special characters, space
    intPattern: /^\d+?$/,
    floatPattern: /^\d+(\.\d{0,2})?$/,
    tenantMaxLength: 30,
} as const;
export type FORM_VALIDATION = (typeof FORM_VALIDATION)[keyof typeof FORM_VALIDATION];

export const REGEX = {
    EMAIL:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    NAME: /^[^[\]\\|'";:/?.>,<)(_=+!@#$%^&*`~0-9-]+$/,
    PASSWORD: /^(?=.*[a-zA-z])(?=.*\d).{8,}$/,
    COLOR: /^#(?:[0-9a-fA-F]{3}){1,2}$/,
    TIME: /^(([0-1]\d{0,1})|(2[0-3]{0,1})):[0-5]\d{0,1}$/,
    URL: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
} as const;
export type REGEX = (typeof REGEX)[keyof typeof REGEX];

export const SORT_DIRECTINO_ICON = {
    ASC: 'mdi_sort_ascending',
    DESC: 'mdi_sort_descending',
} as const;
export type SORT_DIRECTINO_ICON = (typeof SORT_DIRECTINO_ICON)[keyof typeof SORT_DIRECTINO_ICON];

export const ORDER_DIRECTION = {
    ASC: 'asc',
    DESC: 'desc',
} as const;
export type ORDER_DIRECTION = (typeof ORDER_DIRECTION)[keyof typeof ORDER_DIRECTION];

export const ORDER_BY_DEFAULT = {
    CREATED_AT: 'createdAt',
} as const;
export type ORDER_BY_DEFAULT = (typeof ORDER_BY_DEFAULT)[keyof typeof ORDER_BY_DEFAULT];

export const GENDER = {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other',
} as const;
export type GENDER = (typeof GENDER)[keyof typeof GENDER];

export const DEFAULT_LIMIT_FOR_PANINATION = 10;
export const DEFAULT_PAGE_FOR_PANINATION = 1;

export const ROLE = {
    ADMIN: 'admin',
    USER: 'user',
} as const;
export type ROLE = (typeof ROLE)[keyof typeof ROLE];

export const DAYS_OF_WEEK = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7,
} as const;
export type DAYS_OF_WEEK = (typeof DAYS_OF_WEEK)[keyof typeof DAYS_OF_WEEK];

export const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended',
} as const;
export type USER_STATUS = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const DEFAULT_COMMON_LIST_QUERY = {
    page: DEFAULT_PAGE_FOR_PANINATION,
    limit: DEFAULT_LIMIT_FOR_PANINATION,
    orderBy: ORDER_BY_DEFAULT.CREATED_AT,
    orderDirection: ORDER_DIRECTION.DESC,
}


