import { ContainerLayout } from "./Container";
import { Empty } from "./Empty";
import { Error } from "./Error";
import { RootFlatList } from "./Flatlist";
import { FooterLayout } from "./Footer";
import { RootSectionList } from "./SectionList";
import { Formulario } from "./Formulario";
import { Action } from "./Formulario/Action";
import { Header } from "./Header";
import { Loading } from "./Loading";
import { LayoutModal } from "./Modal";
import { RootLayout } from "./Root";
import { RootScroll } from "./Scroll";
import { Separator } from "./Separator";
import { Skeleton } from "./Skeleton";
import { Title } from "./Title";

export const Layout = {
  Header,
  Root: RootLayout,
  Loading,
  Formulario,
  Button: Action,
  List: RootFlatList,
  Title,
  Container: ContainerLayout,
  Footer: FooterLayout,
  Skeleton,
  Separator,
  Scroll: RootScroll,
  Empty,
  Error,
  Modal: LayoutModal,
  SectionList: RootSectionList,
};
