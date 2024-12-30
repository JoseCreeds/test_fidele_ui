import {
    CircleOffIcon,
    BoxMultipleIcon,
    AppsIcon,
    FileTextIcon,
    FileDotsIcon,
    FilesIcon,
    EditIcon,
    BorderAllIcon,
    BorderHorizontalIcon,
    BorderInnerIcon,
    BorderTopIcon,
    BorderVerticalIcon,
    BoxIcon,
    AlertCircleIcon,
    LoginIcon,
    UserPlusIcon,
    RotateIcon,
    CurrencyDollarIcon,
    ChartLineIcon,
    ChartAreaIcon,
    ChartDotsIcon,
    ChartArcsIcon,
    ChartCandleIcon,
    ChartDonut3Icon,
    ChartRadarIcon,
    ShoppingCartIcon,
    ApertureIcon,
    LayoutIcon,
    HelpIcon,
    UserCircleIcon,
    BoxAlignBottomIcon,
    BoxAlignLeftIcon,
    SettingsIcon,
    ZoomCodeIcon,
    StarIcon,
    AwardIcon,
    MoodSmileIcon,
    Message2Icon,
    PointIcon,
    AppWindowIcon,
    MailIcon,
    BasketIcon,
    CalendarIcon,
    BorderStyle2Icon,
    ColumnsIcon,
    RowInsertBottomIcon,
    EyeTableIcon,
    SortAscendingIcon,
    PageBreakIcon,
    FilterIcon,
    BoxModelIcon,
    ServerIcon,
    JumpRopeIcon,
    LayoutKanbanIcon,
    PhotoAiIcon,
    SearchIcon,
    SocialIcon,
    BinaryIcon,
    BrandTidalIcon,
    HomeIcon,
    FileInfoIcon,
    AddressBookIcon,
    BellDollarIcon,
    TicketIcon,
    FileCheckIcon,
    MapPinIcon,
    BookIcon,
    SteeringWheelIcon,
    ZoomMoneyIcon,
    UsersGroupIcon,
    CoinsIcon,
    HistoryIcon,
    WalletIcon,
    WalletOffIcon,
    ChartArrowsVerticalIcon,
    CashOffIcon,
    CellSignal5Icon,
    BuildingArchIcon,
    SquareKeyIcon,
    WebhookIcon,
    LockAccessIcon,
    CircleCheckIcon,
    AdIcon,
    PackageIcon,
    SubtaskIcon,
    CirclePlusIcon,
    InputSearchIcon,
    AlertTriangleIcon,
    PlayCardIcon,
    IconsOffIcon,
    EyeCheckIcon,
    MapPinCheckIcon,
    RouteIcon,
    MapIcon,
    ArchiveIcon,
    HomeSignalIcon,
    StarsIcon,
    InfoCircleIcon,
    UserMinusIcon,
    DeviceLandlinePhoneIcon,
    PigMoneyIcon,
    HeartHandshakeIcon,
    PackageImportIcon,
    PackageExportIcon,
    VipIcon,
    ArchiveFilledIcon,
    IdIcon,
    PrinterIcon,
    MessagePlusIcon,
    SpeakerphoneIcon,
    Receipt2Icon,
    FriendsIcon,
    DroneIcon,
    HeadsetIcon,
    HeadphonesIcon,
    CloudUploadIcon,
    ArticleIcon,
    NewsIcon,
    CloverIcon,
    FlowerIcon,
    BrandOpenSourceIcon,
    BeerIcon,
    MenuOrderIcon,
    BrandProducthuntIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipBgColor?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
    id?: number;
    groupe?: number;
    isTitle?: boolean;
}

const sidebarItem: menu[] = [
    /* Accueil menu 0 *******************/
    {
        header: 'Accueil'
    },
    {
        title: 'Produits',
        icon: BrandProducthuntIcon,
        // chip: 'New',
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/admin/product'
    },

    {
        title: 'Commandes',
        icon: MenuOrderIcon,
        // chip: 'New',
        chipColor: 'surface',
        chipBgColor: 'secondary',
        to: '/admin/orders'
    }
];

export default sidebarItem;
