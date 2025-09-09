import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RootLayout from '../component/layout/Layout';
import { useRouter } from 'next/router';
import {
  deleteShortVideo,
  getFilmListVideo,
  updateEpisodePosition,
} from '../store/filmListSlice';
import Table from '../extra/Table';
import moment from 'moment';
import { openDialog } from '../store/dialogueSlice';
import VideoDialogue from '../component/filmVideo/VideoDialogue';
import { CiLock, CiUnlock } from 'react-icons/ci';
import Button from '../extra/Button';
import TrashIcon from '../assets/icons/trashIcon.svg';
import EditIcon from '../assets/icons/EditBtn.svg';
import { warning } from '../util/Alert';
import EpisodeListDialogue from '../component/episodeList/EpisodeListDialogue';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { getSetting } from '../store/settingSlice';
import { setToast } from '../util/toastServices';
import { IconEdit, IconLockFilled, IconLockOpen, IconTrash } from '@tabler/icons-react';

const ViewShortVideo = () => {
  const { dialogueType } = useSelector((state) => state.dialogue);
  const dispatch = useDispatch();
  const { query } = useRouter();

  const [page, setPage] = useState(1);
  const [size] = useState(20);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const { filmListVideo, totalUser } = useSelector((state) => state.filmsList);

  

  const userId = query.movieSeriesId;

  // Initialize data when filmListVideo changes
  useEffect(() => {
    if (page === 1) {
      setData(filmListVideo);
    } else {
      setData((prevData) => {
        const newVideos = filmListVideo.filter(
          (video) => !prevData.some((prevVideo) => prevVideo._id === video._id)
        );
        return [...prevData, ...newVideos];
      });
    }

    // Check if we have more data to load
    setHasMore(data.length + filmListVideo.length < totalUser);
  }, [filmListVideo, totalUser]);

  // Load initial data
  useEffect(() => {
    if (userId) {
      setPage(1);
      setData([]);
      dispatch(
        getFilmListVideo({
          start: 1,
          limit: size,
          movieSeriesId: userId,
        })
      );
       dispatch(getSetting());
    }
  }, [userId]);

  // Infinite scroll implementation
  const lastVideoElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        // if (entries[0].isIntersecting && hasMore && !isLoading) {
        //   setPage((prevPage) => {
        //     const nextPage = prevPage + 1;
        //     dispatch(
        //       getFilmListVideo({
        //         start: nextPage,
        //         limit: size,
        //         movieSeriesId: userId,
        //       })
        //     );
        //     return nextPage;
        //   });
        // }
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            dispatch(
              getFilmListVideo({
                start: nextPage,
                limit: size,
                movieSeriesId: userId,
              })
            );
            return nextPage;
          });
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, userId, size]
  );

  const handleDeleteFilmCategory = (video) => {
    
    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(
            deleteShortVideo({
              shortVideoId: video?._id,
              movieSeriesId: userId,
              start: 1,
              limit: size,
            })
          ).then((res) => {
            // Refresh the entire list after deletion
            setPage(1);
            setData([]);
            dispatch(
              getFilmListVideo({
                start: 1,
                limit: size,
                movieSeriesId: userId,
              })
            );
          });
        }
      })
      .catch((err) => console.log(err));
  };

  // Drag and drop functionality
  const handleOnDragEnd = (result) => {
    
    if (!result.destination) return;

    // don't allow first episode
    if (result.source.index === 0 || result.destination.index === 0) {
      return setToast('error', 'Trailer cannot be moved');
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // If dropped in the same position, do nothing
    if (sourceIndex === destinationIndex) return;

    const items = Array.from(data);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    // Update episode numbers based on new positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      episodeNumber: index + 1,
    }));

    // Update local state immediately for better UX
    setData(updatedItems);

    // Only update the moved episode's position - single API call
    const movedEpisode = updatedItems[destinationIndex];
    const newEpisodePosition = destinationIndex;

    dispatch(
      updateEpisodePosition({
        movieSeriesId: userId,
        shortVideoId: movedEpisode._id,
        newEpisodePosition: newEpisodePosition,
      })
    ).then(() => {
      setTimeout(() => {
        setPage(1);
        // setData([]);
        dispatch(
          getFilmListVideo({
            start: page,
            limit: size,
            movieSeriesId: userId,
          })
        );
      }, 1500);
    });
  };

  const ManageVideoTable = useMemo(
    () => [
      {
        Header: 'Drag',
        body: 'drag',
        Cell: ({ index }) => (
          <div
            className="drag-handle"
            style={{
              cursor: 'grab',
              fontSize: '18px',
              color: '#666',
              textAlign: 'center',
              userSelect: 'none',
              padding: '5px',
            }}
          >
            ⋮⋮
          </div>
        ),
      },
      {
        Header: 'No',
        body: 'no',
        Cell: ({ index }) => <span className="text-nowrap">{index + 1}</span>,
      },
      {
        Header: 'Video Image',
        body: 'image',
        Cell: ({ row }) => {
          return (
            <div className="userTableImage">
              <img
                src={row?.videoImage || '/images/default-movie-poster.jpg'}
                width={75}
                height={100}
                alt="Thumbnail"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/default-movie-poster.jpg';
                }}
              />
            </div>
          );
        },
      },
      {
        Header: 'video',
        body: 'video',
        Cell: ({ row }) => {
          const [videoError, setVideoError] = useState(false);
          return (
            <>
              {!videoError ? (
                <video
                  width={75}
                  height={100}
                  muted
                  controls
                  src={row?.videoUrl}
                  onError={() => setVideoError(true)}
                />
              ) : (
                <span>Video Not Found</span>
              )}
            </>
          );
        },
      },
      {
        Header: 'Episode Number',
        body: 'episode number',
        Cell: ({ row, index }) => (
          <div className="userTableImage">
            <span>
              {row?.episodeNumber === 0 ? 'Trailer' : row?.episodeNumber}
            </span>
          </div>
        ),
      },
      {
        Header: 'Locked Status',
        body: 'episode number',
        Cell: ({ row }) => (
          <div className="userTableImage">
            <span>
              {row?.isLocked ? (
                <IconLockFilled className='text-danger' />
              ) : (
                <IconLockOpen className='text-success' />
              )}
            </span>
          </div>
        ),
      },
      {
        Header: 'Coins',
        body: 'coins',
        Cell: ({ row }) => (
          <div className="userTableImage">
            <span>{row?.coin || 0}</span>
          </div>
        ),
      },
      {
        Header: 'Date',
        body: 'date',
        Cell: ({ row }) => (
          <span className="text-capitalize cursorPointer">
            {moment(row?.releaseDate).format('DD/MM/YYYY') || '-'}
          </span>
        ),
      },
      {
        Header: 'Action',
        body: 'action',
        Cell: ({ row }) => (
          <div className="action-button">
            <Button
              btnIcon={
                <IconEdit className='text-secondary' />
              }
                  onClick={() => {
                    
                    dispatch(
                      openDialog({
                        type: 'episodeList',
                        data: row,
                      })
                    );
                  }}
            />
            <Button
              btnIcon={
                <IconTrash className='text-secondary' />
              }
              onClick={() => handleDeleteFilmCategory(row)}
            />
          </div>
        ),
      },
    ],
    [data]
  );

  return (
    <>
      {dialogueType == 'viewVideo' && <VideoDialogue />}
      {dialogueType == 'episodeList' && (
        <EpisodeListDialogue page={page} size={size} />
      )}
      
      <div className='userPage'>
        <div className="user-table real-user mb-3">
          <div className="user-table-top">
            <h5
              style={{
                fontWeight: '500',
                fontSize: '20px',
                marginBottom: '5px',
                marginTop: '5px',
              }}
            >
              Short Videos - Drag & Drop to Reorder
            </h5>
            <small className="text-muted">
              Total Episodes: {data.length}{' '}
              {hasMore ? '(Loading more...)' : '(All loaded)'}
            </small>
          </div>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="videos">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <Table
                    data={data}
                    mapData={ManageVideoTable}
                    type={'client'}
                    isDraggable={true}
                    lastElementRef={lastVideoElementRef}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Loading indicator */}
          {/* {isLoading && (
            <div className="text-center mt-3">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading more episodes...</p>
            </div>
          )} */}

          {/* No more data indicator */}
          {!hasMore && data.length > 0 && (
            <div className="text-center my-3">
              <p className="text-muted">No more episodes to load</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .drag-handle:active {
          cursor: grabbing;
        }

        .dragging-row {
          background-color: #f5f5f5;
          transform: rotate(1deg);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </>
  );
};

export default ViewShortVideo;
ViewShortVideo.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
