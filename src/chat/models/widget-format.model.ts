export interface Button {
    type?: string;
    text?: string;
    url?: string;
    target?: string;
}

export interface OrderHeaderWidget {
    orderId?: string;
    button?: Button;
    widgetType?: string;
}

export interface ImageUrl {
    url?: string;
    alternateText?: string;
    quantity?: number;
}


export interface OrderPackage {
    title?: string;
    subtitle?: string;
    order_status?: string;
    imageUrl?: ImageUrl[];
}

export interface PackageListWidget{
    widgetType?: string;
    packageList?: OrderPackage[] | OrderPackage;
}

export interface RootObject {
    widget?: OrderHeaderWidget[] | PackageListWidget[] ;
    type?: string;
}
