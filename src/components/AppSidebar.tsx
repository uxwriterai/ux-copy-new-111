import { 
  AlertCircle, 
  BarChart2, 
  FileText, 
  Home, 
  MessageSquare, 
  Settings, 
  SplitSquareVertical 
} from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "UX Copy Improver",
    url: "/",
    icon: Home,
  },
  {
    title: "UX Copy Analysis",
    url: "/analysis",
    icon: BarChart2,
  },
  {
    title: "A/B Testing Generator",
    url: "/generator",
    icon: SplitSquareVertical,
  },
  {
    title: "Accessibility Checker",
    url: "/accessibility",
    icon: FileText,
  },
  {
    title: "Tone Adjuster",
    url: "/tone",
    icon: MessageSquare,
  },
  {
    title: "Error Enhancer",
    url: "/error",
    icon: AlertCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <svg width="63" height="11" viewBox="0 0 63 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M59.3938 10L60.4847 3.45456H62.3L61.2091 10H59.3938ZM61.5799 2.60228C61.31 2.60228 61.087 2.5128 60.9108 2.33382C60.7375 2.152 60.6665 1.93609 60.6978 1.68609C60.729 1.43041 60.8512 1.2145 61.0643 1.03836C61.2773 0.859386 61.5188 0.769897 61.7887 0.769897C62.0586 0.769897 62.2787 0.859386 62.4492 1.03836C62.6197 1.2145 62.6907 1.43041 62.6623 1.68609C62.6339 1.93609 62.5131 2.152 62.3 2.33382C62.0898 2.5128 61.8498 2.60228 61.5799 2.60228Z" fill="currentColor"/>
              <path d="M54.2823 10.1236C53.8676 10.1236 53.5082 10.0511 53.2042 9.90626C52.9031 9.75853 52.6815 9.53978 52.5394 9.25001C52.3974 8.96023 52.3619 8.60086 52.4329 8.17188C52.4954 7.80824 52.6133 7.50427 52.7866 7.25995C52.9627 7.01279 53.1772 6.81393 53.4301 6.66336C53.6829 6.51279 53.9627 6.39773 54.2696 6.31819C54.5792 6.23864 54.8988 6.18466 55.2284 6.15626C55.609 6.11648 55.9187 6.07813 56.1573 6.0412C56.3988 6.00427 56.5792 5.95171 56.6985 5.88353C56.8179 5.81251 56.8903 5.70739 56.9159 5.56819V5.54262C56.9585 5.27557 56.9088 5.06819 56.7667 4.92046C56.6275 4.76989 56.4045 4.69461 56.0977 4.69461C55.7738 4.69461 55.4983 4.76563 55.271 4.90768C55.0465 5.04972 54.886 5.23012 54.7894 5.44887L53.136 5.31251C53.2838 4.91478 53.5068 4.57103 53.8051 4.28126C54.1062 3.98864 54.4684 3.76421 54.8917 3.60796C55.315 3.44887 55.7894 3.36932 56.315 3.36932C56.6787 3.36932 57.0181 3.41194 57.3335 3.49716C57.6517 3.58239 57.9258 3.71449 58.1559 3.89347C58.3889 4.07245 58.5565 4.30256 58.6588 4.58381C58.7639 4.86222 58.7852 5.19603 58.7227 5.58523L57.9855 10H56.2639L56.4173 9.09234H56.3662C56.2269 9.29688 56.0565 9.47728 55.8548 9.63353C55.6531 9.78694 55.4215 9.90768 55.1602 9.99574C54.8988 10.081 54.6062 10.1236 54.2823 10.1236ZM55.011 8.87074C55.2752 8.87074 55.5181 8.81819 55.7397 8.71307C55.9642 8.60512 56.1488 8.46023 56.2937 8.27841C56.4414 8.0966 56.5352 7.89063 56.575 7.66052L56.6858 6.96591C56.6289 7.00285 56.5465 7.03552 56.4386 7.06393C56.3335 7.09233 56.2184 7.11932 56.0934 7.14489C55.9713 7.16762 55.8477 7.18893 55.7227 7.20881C55.5977 7.22586 55.4855 7.2429 55.386 7.25995C55.1673 7.2912 54.9713 7.34091 54.798 7.4091C54.6247 7.47728 54.484 7.56961 54.3761 7.68609C54.2681 7.79972 54.2014 7.94177 54.1758 8.11222C54.136 8.35938 54.1943 8.5483 54.3505 8.67898C54.5096 8.80682 54.7298 8.87074 55.011 8.87074Z" fill="currentColor"/>
              <path d="M50.0007 10.1108C49.7137 10.1108 49.478 10.0114 49.2933 9.81251C49.1115 9.61365 49.0291 9.37217 49.0461 9.08808C49.066 8.80683 49.1839 8.56961 49.3998 8.37643C49.6186 8.18041 49.87 8.0824 50.1541 8.0824C50.4268 8.0824 50.6569 8.18041 50.8444 8.37643C51.0319 8.57245 51.1143 8.80967 51.0916 9.08808C51.0774 9.27558 51.0163 9.44745 50.9084 9.6037C50.8032 9.75711 50.6697 9.88069 50.5078 9.97444C50.3459 10.0654 50.1768 10.1108 50.0007 10.1108Z" fill="currentColor"/>
              <path d="M44.6985 9.99998L45.7894 3.45453H47.5493L47.3576 4.59657H47.4258C47.6133 4.19032 47.8647 3.88351 48.18 3.67612C48.4982 3.46589 48.8405 3.36078 49.207 3.36078C49.2979 3.36078 49.3931 3.36646 49.4925 3.37782C49.5948 3.38635 49.6857 3.40055 49.7652 3.42044L49.4925 5.03549C49.413 5.00709 49.2993 4.98436 49.1516 4.96731C49.0067 4.94743 48.8689 4.93748 48.7383 4.93748C48.4741 4.93748 48.2283 4.99572 48.001 5.1122C47.7738 5.22584 47.582 5.38493 47.4258 5.58947C47.2723 5.79402 47.1715 6.02981 47.1232 6.29686L46.5138 9.99998H44.6985Z" fill="currentColor"/>
              <path d="M40.4808 10.1278C39.8104 10.1278 39.255 9.99148 38.8146 9.71876C38.3743 9.44319 38.0646 9.05398 37.8857 8.55114C37.7095 8.04546 37.6797 7.44745 37.7962 6.75711C37.9098 6.08381 38.1385 5.4929 38.4822 4.98438C38.8288 4.47586 39.2635 4.07955 39.7862 3.79546C40.309 3.51137 40.8913 3.36932 41.5334 3.36932C41.9652 3.36932 42.3558 3.43893 42.7053 3.57813C43.0575 3.71449 43.3501 3.92188 43.5831 4.20029C43.8161 4.47586 43.9751 4.82103 44.0604 5.2358C44.1484 5.65057 44.147 6.13637 44.0561 6.69319L43.9751 7.19177H38.4524L38.6271 6.06677H42.4453C42.4879 5.8054 42.4709 5.57387 42.3942 5.37216C42.3175 5.17046 42.1896 5.01279 42.0107 4.89915C41.8317 4.78268 41.6115 4.72444 41.3501 4.72444C41.0831 4.72444 40.8331 4.78978 40.6001 4.92046C40.3672 5.05114 40.1712 5.22302 40.0121 5.43609C39.8558 5.64631 39.755 5.87501 39.7095 6.12216L39.5092 7.23864C39.4524 7.58239 39.4638 7.8679 39.5433 8.09518C39.6257 8.32245 39.7678 8.4929 39.9695 8.60654C40.1712 8.71734 40.4269 8.77273 40.7365 8.77273C40.9382 8.77273 41.1271 8.74432 41.3033 8.68751C41.4823 8.63069 41.6413 8.54688 41.7805 8.43609C41.9198 8.32245 42.0334 8.18182 42.1215 8.01421L43.7791 8.12501C43.6257 8.52841 43.3928 8.88069 43.0803 9.18182C42.7678 9.48012 42.3913 9.71307 41.951 9.88069C41.5135 10.0455 41.0234 10.1278 40.4808 10.1278Z" fill="currentColor"/>
              <path d="M37.4936 3.45453L37.2677 4.81817H33.3217L33.5518 3.45453H37.4936ZM34.7024 1.88635H36.5177L35.5035 7.98863C35.4751 8.15624 35.4794 8.28692 35.5163 8.38067C35.5533 8.47158 35.6143 8.5355 35.6996 8.57243C35.7876 8.60936 35.8927 8.62783 36.0149 8.62783C36.1001 8.62783 36.1868 8.62073 36.2748 8.60652C36.3629 8.58948 36.4297 8.57669 36.4751 8.56817L36.5433 9.91902C36.441 9.95027 36.3033 9.98436 36.13 10.0213C35.9595 10.0582 35.7578 10.081 35.5248 10.0895C35.0817 10.1065 34.7067 10.0483 34.3998 9.91476C34.093 9.7784 33.8729 9.56959 33.7393 9.28834C33.6058 9.00709 33.5774 8.6534 33.6541 8.22726L34.7024 1.88635Z" fill="currentColor"/>
              <path d="M29.6516 10L30.7425 3.45456H32.5579L31.467 10H29.6516ZM31.8377 2.60228C31.5678 2.60228 31.3448 2.5128 31.1687 2.33382C30.9954 2.152 30.9243 1.93609 30.9556 1.68609C30.9868 1.43041 31.109 1.2145 31.3221 1.03836C31.5351 0.859386 31.7766 0.769897 32.0465 0.769897C32.3164 0.769897 32.5366 0.859386 32.707 1.03836C32.8775 1.2145 32.9485 1.43041 32.9201 1.68609C32.8917 1.93609 32.7709 2.152 32.5579 2.33382C32.3476 2.5128 32.1076 2.60228 31.8377 2.60228Z" fill="currentColor"/>
              <path d="M24.7415 9.99998L25.8324 3.45453H27.5923L27.4005 4.59657H27.4687C27.6562 4.19032 27.9076 3.88351 28.223 3.67612C28.5412 3.46589 28.8835 3.36078 29.25 3.36078C29.3409 3.36078 29.4361 3.36646 29.5355 3.37782C29.6378 3.38635 29.7287 3.40055 29.8082 3.42044L29.5355 5.03549C29.4559 5.00709 29.3423 4.98436 29.1946 4.96731C29.0497 4.94743 28.9119 4.93748 28.7812 4.93748C28.517 4.93748 28.2713 4.99572 28.044 5.1122C27.8167 5.22584 27.625 5.38493 27.4687 5.58947C27.3153 5.79402 27.2145 6.02981 27.1662 6.29686L26.5568 9.99998H24.7415Z" fill="currentColor"/>
              <path d="M15.8257 9.99998L15.1353 3.45453H16.972L17.2532 7.85226H17.3129L19.1026 3.45453H20.9052L21.2461 7.82669H21.3015L23.0316 3.45453H24.864L21.9961 9.99998H20.0742L19.6311 5.88351H19.5501L17.7433 9.99998H15.8257Z" fill="currentColor"/>
              <path d="M10.2518 3.45453L11.07 5.74288L12.685 3.45453H14.5473L12.1055 6.72726L13.5075 9.99998H11.6538L10.7376 7.7372L9.09271 9.99998H7.21771L9.70635 6.72726L8.3768 3.45453H10.2518Z" fill="currentColor"/>
              <path d="M4.84089 7.21305L5.46731 3.45453H7.28265L6.19174 9.99998H4.44885L4.64487 8.81106H4.57669C4.37498 9.19459 4.08095 9.50282 3.69458 9.73578C3.30822 9.96873 2.8693 10.0852 2.37782 10.0852C1.94032 10.0852 1.571 9.98578 1.26987 9.78692C0.971573 9.58805 0.759925 9.30538 0.634925 8.9389C0.509925 8.57243 0.488619 8.13351 0.571005 7.62214L1.26987 3.45453H3.08521L2.446 7.29828C2.38635 7.68464 2.44032 7.99004 2.60794 8.21447C2.77555 8.4389 3.03123 8.55112 3.37498 8.55112C3.59373 8.55112 3.80538 8.5014 4.00993 8.40197C4.21731 8.2997 4.39629 8.14913 4.54686 7.95027C4.69743 7.7514 4.79544 7.50567 4.84089 7.21305Z" fill="currentColor"/>
            </svg>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}