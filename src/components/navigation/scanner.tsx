/* eslint-disable @typescript-eslint/ban-ts-comment */
// This one is for scanning it

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Html5Qrcode } from "html5-qrcode";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { type Attendee, type Pass, type BadgeType as Badge } from "api/schema";
import { toast } from "react-toastify";
import Typography from "ui/common/typography";
import { FlexRow } from "ui/common/styles/styledComponents";
import useHistory from "hooks/useHistory";
import { updateAttendee } from "api/apiServices/attendeeRoutes";
import { getPatchItem, PatchItem } from "api/utils";
import { getCurrentDateForApi } from "utils/dateUtils";
import {
  BackWrapper,
  CameraContainer,
  Container,
  ExitIcon,
  ExitWrapper,
  IconSection,
  InfoSection,
  Navbar,
} from "../../../../Components/Events/checkinStyledComponents";
import { Padding } from "../../../../Components/Events/styledComponents";
import { reactQueryKeys } from "../../../../utils/constants";
import EventHead from "../../../../Components/Events/shared/EventHead";
import BadgeComponent from "../../../../Components/Events/shared/BadgeComponent";
import { EventContext } from "../../../../context/event";

type ViewOptions = {
  fps: number;
  qrbox: { width: number; height: number };
  aspectRatio?: number;
};

const CheckInScanner = () => {
  useHistory({ updateHistory: true });

  const router = useRouter();
  const { eventId } = router.query;

  const queryClient = useQueryClient();
  const eventContext = useContext(EventContext);
  const { getBadgesByEvent } = eventContext;

  const [scanner, setScanner] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [isCheckInSuccess, setIsCheckInSuccess] = useState(false);

  const [attendee, setAttendee] = useState<Attendee>(null);

  const [isMobile, setIsMobile] = useState(false);

  const { data: badges } = useQuery<Badge[]>(
    [reactQueryKeys.badges, eventId],
    () => getBadgesByEvent(eventId as string),
    { enabled: !!eventId }
  );

  const qrCodeSuccessCallback = (decodedText) => {
    setTicketId(decodedText);
  };

  const qrCodeErrorCallback = () => null;

  const startCamera = () => {
    if (!scanner) {
      const html5QrCode = new Html5Qrcode("reader");

      const viewOptions: ViewOptions = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: isMobile
          ? +(window.innerWidth / (window.innerHeight - 130)).toFixed(2)
          : 1,
      };

      html5QrCode.start(
        { facingMode: "environment" },
        viewOptions,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );

      setScanner(html5QrCode);
    }
  };

  useEffect(() => {
    if (window !== undefined) {
      setIsMobile(window.innerWidth < 600);
      startCamera();
    }
  }, []);

  const resetScanner = () => {
    setTimeout(() => {
      setAttendee(null);
      setTicketId(null);
      setIsCheckInSuccess(false);

      scanner.resume();
    }, 5000);
  };

  const checkInMutation = useMutation(
    (reqBody: PatchItem[]) => updateAttendee(ticketId, reqBody),
    {
      onSuccess: (res) => {
        setAttendee(res);
        setIsCheckInSuccess(true);

        queryClient.invalidateQueries("attendee");
        resetScanner();
      },
      onError: () => {
        toast.error("Oops, something went wrong during this check-in.");
      },
    }
  );

  const onCheckIn = async () => {
    const reqBody = [
      getPatchItem("/checkedIn", true),
      getPatchItem("/checkinDate", getCurrentDateForApi()),
    ];

    await checkInMutation.mutateAsync(reqBody);
  };

  useEffect(() => {
    if (ticketId) {
      scanner.pause(true);
      onCheckIn();
    }
  }, [ticketId]);

  const onNavBack = async () => {
    await scanner.stop();
    router.back();
  };

  const getAttendeeDisplay = () => {
    if (attendee) {
      if (attendee.firstName || attendee.lastName) {
        return `${attendee.firstName} ${attendee.lastName}`;
      }
      return attendee.email;
    }
    return "";
  };

  const getBadge = (pass: Pass) =>
    badges.find((b) => b.badgeTypeId === pass.badgeTypeId);

  return (
    <Container>
      <EventHead title="Scan Pass" />
      <Navbar>
        <BackWrapper onClick={onNavBack}>
          <i className="fa-regular fa-arrow-left" />
          <Typography variant="h6" component="h6">
            Check In
          </Typography>
        </BackWrapper>
        <ExitWrapper>
          <ExitIcon className="fa-solid fa-xmark" onClick={onNavBack} />
        </ExitWrapper>
      </Navbar>
      <CameraContainer id="reader" />
      <InfoSection>
        <IconSection success={isCheckInSuccess}>
          {isCheckInSuccess ? (
            <i className="fa-solid fa-circle-check" />
          ) : (
            <i className="fa-regular fa-barcode-read" />
          )}
        </IconSection>
        <Padding padding="0 0 0 16px">
          <Typography
            variant="subtitle1"
            component="subtitle1"
            fontWeight="700"
            lineHeight="1.5"
          >
            {attendee && isCheckInSuccess ? getAttendeeDisplay() : "Scan Pass"}
          </Typography>
          {attendee &&
            isCheckInSuccess &&
            attendee.tickets.map((ticket) => (
              <>
                <Typography
                  variant="subtitle1"
                  component="subtitle1"
                  lineHeight="1"
                >
                  <FlexRow align="center">
                    {ticket.pass.name}&nbsp;
                    {getBadge(ticket.pass) && "  -  "}&nbsp;
                    {getBadge(ticket.pass) && (
                      <BadgeComponent badge={getBadge(ticket.pass)} size={15} />
                    )}
                  </FlexRow>
                </Typography>
                <Padding padding="0 0 4px" />
              </>
            ))}
        </Padding>
      </InfoSection>
    </Container>
  );
};

export default CheckInScanner;

// Display the qr code

/* eslint-disable @next/next/no-img-element */
// import React from "react";
// import { useRouter } from "next/router";
// import { useQuery } from "react-query";
// import Link from "next/link";
// import { Accordion, Button, Text, createStyles } from "@mantine/core";
// import { QRCodeSVG } from "qrcode.react";
// import "react-awesome-slider/dist/styles.css";
// import "react-awesome-slider/dist/custom-animations/scale-out-animation.css";

// import { type Event } from "api/schema";
// import {
//   getRegEventById,
//   getRegEventByShortCode,
// } from "api/apiServices/eventRoutes";
// import { getAccount } from "api/apiServices/authRoutes";
// import Typography from "ui/common/typography";
// @ts-ignore
// import Ticket from "ui/svg/ticket.svg";
// // @ts-ignore
// import EPLogo from "ui/files/images/event-penguin-light.png";
// import { getBaseUrls } from "utils/urlUtils";
// import useHistory from "hooks/useHistory";
// import {
//   CardImgWrapper,
//   CoverImg,
//   EventDetailsContainer,
//   EventDetailsWrapper,
//   Logo,
//   PassesColumn,
// } from "../../../Components/MyEvents/styledComponents";
// import {
//   FlexColumn,
//   HeaderNavContainer,
//   Padding,
//   PageContainer,
// } from "../../../Components/shared/sharedStyles";
// import DateAndLocation from "../../../Components/MyEvents/DateAndLocation";
// import VirtualStreamInfo from "../../../Components/MyEvents/VirtualStreamInfo";
// import { Card } from "../../../Components/shared/cardStyledComponents";
// import MobileSidebar from "../../../Components/Nav/Main/MobileSidebar/MobileSidebar";
// import PassesColumnSkeleton from "../../../Components/MyEvents/PassesColumnSkeleton";
// import { fetchEventTickets } from "../../../Components/MyEvents/helpers";
// import AccountHead from "../../../Components/Common/AccountHead";
// import { reactQueryKeys } from "../../../utils/consts";
// import { eventAccessTypes } from '../../../../../../apps/dashboard/utils/constants';

// const today = new Date();

// export const useStyles = createStyles((theme) => ({
//   control: {
//     display: "grid",
//     gridTemplateColumns: "auto 1fr",
//     alignItems: "center",
//     columnGap: "16px",
//   },
//   item: {
//     borderRadius: theme.radius.md,
//     marginBottom: theme.spacing.lg,

//     border: `1px solid ${
//       theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
//     }`,
//   },
// }));

// const EventDetailsPage = () => {
//   const { classes } = useStyles();
//   useHistory({ updateHistory: true });

//   const router = useRouter();
//   const { asPath } = router;
//   const { id } = router.query;

//   const { data: account } = useQuery(reactQueryKeys.account, getAccount);

//   const { data: event } = useQuery<Event>(["events", id, account], () =>
// @ts-ignore
//     getRegEventById(id)
//   ); // this doesn't return all the properties - we should update this api route

//   const { data: fullEvent } = useQuery<Event>(
//     ["event", event?.shortCode],
// @ts-ignore
//     () => getRegEventByShortCode(event?.shortCode),
//     {
//       enabled: !!event,
//     }
//   );

//   const { data, isLoading, isFetching, status } = useQuery(
//     ["event-attendee-tickets", id],
//     () => fetchEventTickets(id, account),
//     { enabled: !!id && !!account }
//   );

//   const getBtnDisabled = () => {
//     let isAfterDate = false;
//     if (fullEvent?.eventSchedule?.endDate) {
//       const endDate = new Date(fullEvent.eventSchedule.endDate);
//       isAfterDate = today.getTime() > endDate.getTime();
//     }

// @ts-ignore
//     const hasOrders = data?.tickets?.length > 0 || data?.tickets?.length > 0;

//     return isAfterDate || !hasOrders;
//   };

//   return (
//     <PageContainer>
//       <AccountHead title={event ? event.name : "Event"} />
//       <MobileSidebar header="Event Details" />
//       <EventDetailsContainer>
//         {event && Object.keys(event).length > 0 && (
//           <EventDetailsWrapper>
//             <FlexColumn>
//               <HeaderNavContainer>
//                 <Link href="/account">My Account</Link>
//                 <i className="fa-solid fa-chevron-right" />
//                 <Link href="/account/my-events">My Events</Link>
//                 <i className="fa-solid fa-chevron-right" />
//                 Event Details
//               </HeaderNavContainer>
//               <Padding padding="34px 0 0">
//                 <Typography variant="h1" component="h1">
//                   Event Details
//                 </Typography>
//               </Padding>
//               <FlexColumn align="center" padding="24px 0 0">
//                 {event?.eventContent?.coverPhoto?.url && (
//                   <CoverImg
//                     src={event.eventContent.coverPhoto.url}
//                     alt="event cover photo"
//                   />
//                 )}
//                 {!event?.eventContent?.coverPhoto?.url && (
//                   <CardImgWrapper width="375px" height="225px" />
//                 )}
//                 <Padding
//                   padding="8px 0"
//                   onClick={() =>
//                     router.push(
//                       `${getBaseUrls().registration}/event/${
//                         event.shortCode
//                       }/about`
//                     )
//                   }
//                   style={{ cursor: "pointer" }}
//                 >
//                   <Typography variant="h5" component="h5" fontWeight="800">
//                     {event.name}
//                   </Typography>
//                 </Padding>
//                 {(event.eventAccessType === eventAccessTypes.inPerson || event.eventAccessType === eventAccessTypes.hybrid) && (
//                   <DateAndLocation
//                   eventSchedule={fullEvent?.eventSchedule}
//                   location={fullEvent?.eventLocationSearch}
//                   />
//                   )}
//                   {(event.eventAccessType === eventAccessTypes.virtual || event.eventAccessType === eventAccessTypes.hybrid) && (
//                     <VirtualStreamInfo event={event} />
//                   )}
//               </FlexColumn>
//             </FlexColumn>
//             {isLoading ? (
//               <PassesColumnSkeleton />
//             ) : (
//               <PassesColumn>
//                 <Button
//                   fullWidth
//                   radius="xl"
//                   size="lg"
//                   disabled={getBtnDisabled()}
//                   onClick={() => router.push(`${asPath}/transfer-passes`)}
//                   rightIcon={
//                     <i
//                       className="fa-duotone fa-paper-plane-top"
//                       style={{ marginBottom: 3, fontSize: 18 }}
//                     />
//                   }
//                 >
//                   Transfer Passes
//                 </Button>

//                 <Padding padding="20px 0 16px">
//                   {/* @ts-ignore */}
//                   {data?.tickets?.length > 0 ? (
//                     <Typography variant="body4" component="body4">
//                       Your Passes {/* @ts-ignore */}
//                       {data?.tickets?.length > 0
//                         ? `(${data?.tickets?.length})`
//                         : ""}
//                     </Typography>
//                   ) : (
//                     <Card padding="16px" width="375px" height="fit-content">
//                       {isFetching && <p>Fetching your passes</p>}
//                       {status === "error" && (
//                         <p>There was an error fetching your passes</p>
//                       )}
//                       {!isFetching && status !== "error" && (
//                         <p>You don&apos;t have any passes.</p>
//                       )}
//                     </Card>
//                   )}
//                 </Padding>

//                 <div style={{ width: 375 }}>
//                   <Accordion defaultValue="ticket-0">
//                     {data?.tickets?.map((ticket, index) => (
//                       <Accordion.Item
//                         key={index}
//                         value={`ticket-${index}`}
//                         className={classes.item}
//                       >
//                         <Accordion.Control>
//                           <div className={classes.control}>
//                             <Ticket />
//                             <Text size="sm">{ticket.pass.name}</Text>
//                             <FlexColumn padding="0 0 0 16px" />
//                           </div>
//                         </Accordion.Control>
//                         <Accordion.Panel>
//                           <FlexColumn align="center" width="100%">
//                             <QRCodeSVG
//                               value={data?.tickets[0]?.ticketId.toString()}
//                             />
//                             <Logo src={EPLogo.src} alt="" />
//                           </FlexColumn>
//                         </Accordion.Panel>
//                       </Accordion.Item>
//                     ))}
//                   </Accordion>
//                 </div>
//               </PassesColumn>
//             )}
//           </EventDetailsWrapper>
//         )}
//       </EventDetailsContainer>
//     </PageContainer>
//   );
// };

// export default EventDetailsPage;
