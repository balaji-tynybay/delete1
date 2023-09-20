export type SidebarItemsType = (
  | {
      display: string;
      icon: JSX.Element;
      to: string;
      section: string;
      subOptions?: undefined;
    }
  | {
      display: string;
      icon: JSX.Element;
      to: string;
      section: string;
      subOptions: (
        | {
            display: string;
            icon: JSX.Element;
            to: string;
            childSubOptions: {
              display: string;
              icon: JSX.Element;
              to: string;
            }[];
          }
        | {
            display: string;
            icon: JSX.Element;
            to: string;
            childSubOptions?: undefined;
          }
      )[];
    }
)[];
