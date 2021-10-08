/**
 * Smoke test that verifies that components are correctly exported from
 * their renamed packages / with their new name
 * Background:
 * - https://github.com/vaadin/web-components/issues/1992
 * - https://github.com/vaadin/web-components/issues/1993
 *
 * TODO: Remove after component renaming is complete
 */
import { Accordion } from '@vaadin/accordion';
import { AccordionPanel } from '@vaadin/accordion/vaadin-accordion-panel';
import { AppLayout } from '@vaadin/app-layout';
import { DrawerToggle } from '@vaadin/app-layout/vaadin-drawer-toggle';
import { AvatarGroup } from '@vaadin/avatar-group';
import { Avatar } from '@vaadin/avatar/vaadin-avatar';
import { Board } from '@vaadin/board';
import { BoardRow } from '@vaadin/board/vaadin-board-row';
import { Button } from '@vaadin/button';
import { Chart } from '@vaadin/charts';
import { ChartSeries } from '@vaadin/charts/src/vaadin-chart-series';
import { Checkbox } from '@vaadin/checkbox';
import { CheckboxGroup } from '@vaadin/checkbox-group';
import { ComboBox } from '@vaadin/combo-box';
import { ComboBoxLight } from '@vaadin/combo-box/vaadin-combo-box-light';
import { ConfirmDialog } from '@vaadin/confirm-dialog';
import { ContextMenu } from '@vaadin/context-menu';
import { CookieConsent } from '@vaadin/cookie-consent';
import { Crud } from '@vaadin/crud';
import { CustomField } from '@vaadin/custom-field';
import { DatePicker } from '@vaadin/date-picker';
import { DateTimePicker } from '@vaadin/date-time-picker';
import { Details } from '@vaadin/details';
import { Dialog } from '@vaadin/dialog';
import { FormLayout } from '@vaadin/form-layout';
import { FormItem } from '@vaadin/form-layout/vaadin-form-item';
import { Grid } from '@vaadin/grid';
import { GridColumn } from '@vaadin/grid/vaadin-grid-column';
import { GridColumnGroup } from '@vaadin/grid/vaadin-grid-column-group';
import { GridFilter } from '@vaadin/grid/vaadin-grid-filter';
import { GridFilterColumn } from '@vaadin/grid/vaadin-grid-filter-column';
import { GridSelectionColumn } from '@vaadin/grid/vaadin-grid-selection-column';
import { GridSortColumn } from '@vaadin/grid/vaadin-grid-sort-column';
import { GridSorter } from '@vaadin/grid/vaadin-grid-sorter';
import { GridTreeColumn } from '@vaadin/grid/vaadin-grid-tree-column';
import { GridTreeToggle } from '@vaadin/grid/vaadin-grid-tree-toggle';
import { GridPro } from '@vaadin/grid-pro';
import { GridProEditColumn } from '@vaadin/grid-pro/vaadin-grid-pro-edit-column';
import { Icon } from '@vaadin/icon';
import { Iconset } from '@vaadin/icon/vaadin-iconset';
import { Item } from '@vaadin/item';
import { ListBox } from '@vaadin/list-box';
import { LoginOverlay } from '@vaadin/login';
import { LoginForm } from '@vaadin/login/vaadin-login-form';
import { MenuBar } from '@vaadin/menu-bar';
import { Message } from '@vaadin/message-list/vaadin-message';
import { MessageInput } from '@vaadin/message-input';
import { MessageList } from '@vaadin/message-list';
import { Notification } from '@vaadin/notification';
import { HorizontalLayout } from '@vaadin/horizontal-layout';
import { VerticalLayout } from '@vaadin/vertical-layout';
import { Scroller } from '@vaadin/scroller';
// import { Overlay } from '@vaadin/overlay';
import { ProgressBar } from '@vaadin/progress-bar';
import { RadioButton } from '@vaadin/radio-group/vaadin-radio-button';
import { RadioGroup } from '@vaadin/radio-group';
import { RichTextEditor } from '@vaadin/rich-text-editor';
import { Select } from '@vaadin/select';
import { SplitLayout } from '@vaadin/split-layout';
import { Tabs } from '@vaadin/tabs';
import { Tab } from '@vaadin/tabs/vaadin-tab';
import { TextField } from '@vaadin/text-field';
import { EmailField } from '@vaadin/email-field';
import { IntegerField } from '@vaadin/integer-field';
import { PasswordField } from '@vaadin/password-field';
import { TextArea } from '@vaadin/text-area';
import { TimePicker } from '@vaadin/time-picker';
import { Upload } from '@vaadin/upload';
import { VirtualList } from '@vaadin/virtual-list';

const assertType = <TExpected>(actual: TExpected) => actual;

assertType<HTMLElement>(new Accordion());
assertType<HTMLElement>(new AccordionPanel());
assertType<HTMLElement>(new AppLayout());
assertType<HTMLElement>(new DrawerToggle());
assertType<HTMLElement>(new AvatarGroup());
assertType<HTMLElement>(new Avatar());
assertType<HTMLElement>(new Board());
assertType<HTMLElement>(new BoardRow());
assertType<HTMLElement>(new Button());
assertType<HTMLElement>(new Chart());
assertType<HTMLElement>(new ChartSeries());
assertType<HTMLElement>(new Checkbox());
assertType<HTMLElement>(new CheckboxGroup());
assertType<HTMLElement>(new ComboBox());
assertType<HTMLElement>(new ComboBoxLight());
assertType<HTMLElement>(new ConfirmDialog());
assertType<HTMLElement>(new ContextMenu());
assertType<HTMLElement>(new CookieConsent());
assertType<HTMLElement>(new Crud());
assertType<HTMLElement>(new CustomField());
assertType<HTMLElement>(new DatePicker());
assertType<HTMLElement>(new DateTimePicker());
assertType<HTMLElement>(new Details());
assertType<HTMLElement>(new Dialog());
assertType<HTMLElement>(new FormLayout());
assertType<HTMLElement>(new FormItem());
assertType<HTMLElement>(new Grid());
assertType<HTMLElement>(new GridColumn());
assertType<HTMLElement>(new GridColumnGroup());
assertType<HTMLElement>(new GridFilter());
assertType<HTMLElement>(new GridFilterColumn());
assertType<HTMLElement>(new GridSelectionColumn());
assertType<HTMLElement>(new GridSortColumn());
assertType<HTMLElement>(new GridSorter());
assertType<HTMLElement>(new GridTreeColumn());
assertType<HTMLElement>(new GridTreeToggle());
assertType<HTMLElement>(new GridPro());
assertType<HTMLElement>(new GridProEditColumn());
assertType<HTMLElement>(new Icon());
assertType<HTMLElement>(new Iconset());
assertType<HTMLElement>(new Item());
assertType<HTMLElement>(new ListBox());
assertType<HTMLElement>(new LoginOverlay());
assertType<HTMLElement>(new LoginForm());
assertType<HTMLElement>(new MenuBar());
assertType<HTMLElement>(new Message());
assertType<HTMLElement>(new MessageInput());
assertType<HTMLElement>(new MessageList());
assertType<HTMLElement>(new Notification());
assertType<HTMLElement>(new HorizontalLayout());
assertType<HTMLElement>(new VerticalLayout());
assertType<HTMLElement>(new Scroller());
// assertType<HTMLElement>(new Overlay());
assertType<HTMLElement>(new ProgressBar());
assertType<HTMLElement>(new RadioButton());
assertType<HTMLElement>(new RadioGroup());
assertType<HTMLElement>(new RichTextEditor());
assertType<HTMLElement>(new Select());
assertType<HTMLElement>(new SplitLayout());
assertType<HTMLElement>(new Tabs());
assertType<HTMLElement>(new Tab());
assertType<HTMLElement>(new TextField());
assertType<HTMLElement>(new EmailField());
assertType<HTMLElement>(new IntegerField());
assertType<HTMLElement>(new PasswordField());
assertType<HTMLElement>(new TextArea());
assertType<HTMLElement>(new TimePicker());
assertType<HTMLElement>(new Upload());
assertType<HTMLElement>(new VirtualList());
