'use client';
import { useState, useEffect, lazy, type ComponentType, type ReactNode } from "react";
import {
  Drawer as MaterialDrawer,
  Card as MaterialCard,
  List as MaterialList,
  ListItem as MaterialListItem,
  Accordion as MaterialAccordion,
  AccordionHeader as MaterialAccordionHeader,
  AccordionBody as MaterialAccordionBody,
  Spinner as MaterialSpinner
} from "@material-tailwind/react";
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import { useMobileSidebarStore } from '../../../state/useMobileSidebarStore';
import Link from "next/link";
import SearchIcon from '@mui/icons-material/Search';
const CloseIcon = lazy(() => import('@mui/icons-material/Close'));
import { useProductStore } from "../../../state/useProductStore";
import URLUtils from "../../../scripts/UrlUtils";
import { useAccountsStore } from "../../../state/useAccountsStore";

interface Product {
  _id: string;
  imageUrl: string;
  productId: string;
  name: string;
  description: string;
  salePrice: number | string;
  price: number | string;
  preOrder?: boolean;
  inCart?: boolean;
  link?:string;
}

type MaterialComponentProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

const Drawer = MaterialDrawer as unknown as ComponentType<MaterialComponentProps>;
const Card = MaterialCard as unknown as ComponentType<MaterialComponentProps>;
const List = MaterialList as unknown as ComponentType<MaterialComponentProps>;
const ListItem = MaterialListItem as unknown as ComponentType<MaterialComponentProps>;
const Accordion = MaterialAccordion as unknown as ComponentType<MaterialComponentProps>;
const AccordionHeader = MaterialAccordionHeader as unknown as ComponentType<MaterialComponentProps>;
const AccordionBody = MaterialAccordionBody as unknown as ComponentType<MaterialComponentProps>;
const Spinner = MaterialSpinner as unknown as ComponentType<MaterialComponentProps>;

export function MobileNavSideBar () {
  const [open, setOpen] = useState(0);
  const modalOpen = useMobileSidebarStore((state) => state.isOpen);
  const closeDrawer = useMobileSidebarStore((state) => state.close);
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const setProduct = useProductStore((state) => state.setProduct);
  const customer = useAccountsStore((state) => state.customer);

    useEffect(() => {
      if (searchText.length > 0) {
        const delayed = setTimeout(async () => {
          try {
            setLoading(true);
            const res = await URLUtils.post('Search-GetProduct', {query: {searchText}});
            if (res.status === 200) {
              setProducts(res.data);
            }
          } catch {
            return;
          }
          finally {
            setLoading(false);
          }
        }, 400);
        return () => clearTimeout(delayed);
      }
    }, [searchText]);

    const handlePdp = (e: React.MouseEvent<HTMLElement>) => {
      const pid = e.currentTarget.dataset.pid;
      const data = products.find(product => product._id === pid);
      setProduct(data as Product);
      closeDrawer();
    };



  const consultingMenuItem = (
    <List className="p-0" placeholder={undefined}>
      <ListItem placeholder={undefined}>
        <Link href="/rto-registration" onClick={closeDrawer}>New RTO Registration</Link>
      </ListItem>
      <ListItem placeholder={undefined}>
        <Link href="/rto-cricos-registration" onClick={closeDrawer}>New RTO CRICOS Registration</Link>
      </ListItem>
      <ListItem placeholder={undefined}>
        <Link href="/rto-elicos-registration" onClick={closeDrawer}>New ELICOS Registration</Link>
      </ListItem>
      <ListItem placeholder={undefined}>
        <Link href="/rto-cricos-elicos-registration" onClick={closeDrawer}>New RTO CRICOS ELICOS Registration</Link>
      </ListItem>
      <ListItem placeholder={undefined}>
        <Link href="/rto-renew-registration-service" onClick={closeDrawer}>Renew Registration</Link>
      </ListItem>
      <ListItem placeholder={undefined}>
        <Link href="/rto-compliance-consulting" onClick={closeDrawer}>RTO Compliance Consulting</Link>
      </ListItem>
      <ListItem placeholder={undefined}>
        <Link href="/rto-audit-service" onClick={closeDrawer}>RTO Audit Services</Link>
      </ListItem>
      <ListItem placeholder={undefined}>
        <Link href="/rto-due-deligence-consulting" onClick={closeDrawer}>RTO Due Diligence</Link>
      </ListItem>
      <ListItem placeholder={undefined}>
        <Link href="/rto-website-development-service" onClick={closeDrawer}>Website Development</Link>
      </ListItem>
    </List>
  );

  const sellMenuItems = (
    <List className="p-0" placeholder={undefined}> 
      <ListItem placeholder={undefined}>
        <Link href="/rto-Buy-service" onClick={closeDrawer}>Buy RTO</Link>
      </ListItem>
      <ListItem placeholder={undefined}>
        <Link href="/rto-sell-service" onClick={closeDrawer}>Sell RTO</Link>
      </ListItem>
      <ListItem placeholder={undefined}>
        <Link href="/rto-lease-delivery-location-service" onClick={closeDrawer}>Lease Delivery Location</Link>
      </ListItem>
    </List>
  );

  const handleOpen = (value:number) => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <>
      {modalOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" onClick={closeDrawer} />}
      <Drawer open={modalOpen} onClose={closeDrawer} className="overflow-y-scroll scrollbar-hide z-[9999]" placeholder={undefined}>
      <Card color="transparent" shadow={false} className="h-[calc(100vh-2rem)] w-full p-4" placeholder={undefined}>
        <div className="p-4 relative">
          <p>
                        RTO Specialist
          </p>
          <div className="absolute right-4 bottom-4 cursor-pointer z-50" onClick={closeDrawer} role="button" aria-label="Close Drawer">
            <CloseIcon />
          </div>
        </div>
        <div className="p-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              aria-label="Search for products or services"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {loading ? <Spinner className="h-5 w-5" /> : <SearchIcon className="h-5 w-5 text-gray-500" />}
            </div>
          </div>
        </div>
        <div>
          {
            products?.map(({ _id, productId, name }, index) => (
              <Link href={`/product/${_id}`} onClick={handlePdp} data-pid={_id} className="product-container cursor-pointer" key={index}>
                <div className="border border-gray-100 rounded-md p-4 pointer-events-none">
                  <p className="font-medium text-sm text-black">{productId}</p>
                  <p className="text-xs text-gray-700">{name}</p>
                </div>
              </Link>
            ))
          }
        </div>
        <List placeholder={undefined}>
          <div className="p-3">
            <Link href="/ecommerce-categories" onClick={closeDrawer}>
              <p className="mr-auto font-normal">
                                Training Resources
              </p>
            </Link>
          </div>
          {
            (customer?.accountType === "GENERAL" || customer?.accountType === "PDEV_USER") && 
              <div className="p-3">
                <Link href="/training" onClick={closeDrawer}>
                  <p className="mr-auto font-normal">
                    Development Courses
                  </p>
                </Link>
              </div>
          }
          <div className="p-3">
            <Link href="/professional-development-plans" onClick={closeDrawer}>
              <p className="mr-auto font-normal">
                Professional Development
              </p>
            </Link>
          </div>

          <Accordion
            open={open === 1}
            placeholder={undefined}
            icon={
              <KeyboardArrowDownOutlinedIcon sx={{ rotate: open === 1 ? "180deg" :'0deg'}} />
            }
          >
            <ListItem className="p-0" selected={open === 1} placeholder={undefined}>
              <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3" placeholder={undefined}>
                <p className="antialiased font-sans text-base leading-relaxed text-blue-gray-900 mr-auto font-normal">
                                    Consulting
                </p>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              {consultingMenuItem}
            </AccordionBody>
          </Accordion>
          <Accordion
            open={open === 2}
            placeholder={undefined}
            icon={
              <KeyboardArrowDownOutlinedIcon sx={{ rotate: open === 2 ? "180deg" : '0deg' }} />
            }
          >
            <ListItem className="p-0" selected={open === 2} placeholder={undefined}>
              <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3" placeholder={undefined}>
                <p className="antialiased font-sans text-base leading-relaxed text-blue-gray-900 mr-auto font-normal">
                                    Buy/Sell/Lease
                </p>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0" placeholder={undefined}>
                {sellMenuItems}
              </List>
            </AccordionBody>
          </Accordion>
          <Accordion
            open={open === 3}
            placeholder={undefined}
            icon={
              <KeyboardArrowDownOutlinedIcon sx={{ rotate: open === 3 ? "180deg" : '0deg'}} />
            }
          >
            <ListItem className="p-0" selected={open === 3} placeholder={undefined}>
              <AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3" placeholder={undefined}>
                <p className="antialiased font-sans text-base leading-relaxed text-blue-gray-900 mr-auto font-normal">
                                    Membership
                </p>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0" placeholder={undefined}>
                <List className="p-0" placeholder={undefined}>
                  <ListItem placeholder={undefined}>
                    <Link href="/membership-plans" onClick={closeDrawer}> Explore Memberships</Link>
                  </ListItem>
                </List>
              </List>
            </AccordionBody>
          </Accordion>
          {/* <Accordion
            open={open === 4}
            placeholder={undefined}
            icon={
              <KeyboardArrowDownOutlinedIcon sx={{ rotate: open === 4 ? "180deg" : '0deg'}} />
            }
          >
            <ListItem className="p-0" selected={open === 4} placeholder={undefined}>
              <AccordionHeader onClick={() => handleOpen(4)} className="border-b-0 p-3" placeholder={undefined}>
                <p className="antialiased font-sans text-base leading-relaxed text-blue-gray-900 mr-auto font-normal">
                                    Recruiment
                </p>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0" placeholder={undefined}>
                <List className="p-0" placeholder={undefined}>
                  <ListItem placeholder={undefined}>
                    <Link href="/register-for-work" onClick={closeDrawer}>Register for work</Link>
                  </ListItem>
                  <ListItem placeholder={undefined}>
                    <Link href="/employer-hiring" onClick={closeDrawer}>Employer</Link>
                  </ListItem>
                </List>
              </List>
            </AccordionBody>
          </Accordion> */}
          <div className="p-3">
            <Link href="/book-appointment"  title="Book an appointment with RTO Specialist" onClick={closeDrawer} className="antialiased font-sans text-base leading-relaxed text-blue-gray-900 mr-auto font-normal">Contact</Link>
          </div>
        </List>

      </Card>
    </Drawer>
    </>
  );
}
