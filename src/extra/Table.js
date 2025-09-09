import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

export default function Table(props) {
  const {
    data,
    checkBoxShow,
    mapData,
    Page,
    PerPage,
    type,
    style,
    onChildValue,
    selectAllChecked,
    handleSelectAll,
    isDraggable = false,
    lastElementRef
  } = props;
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [checkBox, setCheckBox] = useState();

  const sortedData =
    data?.length > 0
      ? [...data].sort((a, b) => {
          const valueA = a[sortColumn];
          const valueB = b[sortColumn];

          if (valueA < valueB) {
            return sortOrder === "asc" ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortOrder === "asc" ? 1 : -1;
          }
          return 0;
        })
      : data;

  const startIndex = (Page - 1) * PerPage;
  const endIndex = startIndex + PerPage;

  const currentPageData = Array.isArray(data)
    ? data.slice(startIndex, endIndex)
    : [];

  return (
    <>
      <div
        className="primeMain table-custom"
        // style={{ marginLeft: "10px", marginRight: "10px"  }}
      >
        <table
          width="100%"
          className="primeTable text-center"
          style={{ ...style }}
        >
          <thead
            className=""
            style={{ zIndex: "1", position: "sticky", top: "0" }}
          >
            <tr>
              {mapData?.map((res) => (
                <th className=" text-nowrap" key={res.Header}>
                  <div className="table-head">
                    {res?.Header === "checkBox" ? (
                      <input
                        type="checkbox"
                        checked={selectAllChecked}
                        onChange={handleSelectAll}
                      />
                    ) : (
                      `${" "}${res?.Header}`
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {type === "server" && (
            <tbody>
              {sortedData?.length > 0 ? (
                <>
                  {(PerPage > 0
                    ? [sortedData]?.slice(
                        Page * PerPage,
                        Page * PerPage + PerPage
                      )
                    : sortedData
                  ).map((i, k) => (
                    <tr key={k}>
                      {mapData.map((res) => (
                        <td key={res.body}>
                          {res.Cell ? (
                            <res.Cell row={i} index={k} />
                          ) : (
                            <span className={res?.class}>{i[res?.body]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td
                    colSpan={25}
                    className="text-center"
                   style={{ borderBottom: "none" , padding : '20px' }}
                  >
                    No Data Found !
                  </td>
                </tr>
              )}
            </tbody>
          )}

          {type === "client" && (
            <tbody style={{ maxHeight: "600px" }}>
              {isDraggable ? (
                data?.length > 0 ? (
                  <>
                    {data.map((i, k) => (
                      <Draggable 
                        key={i._id || k} 
                        draggableId={i._id?.toString() || k.toString()} 
                        index={k}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={(el) => {
                              provided.innerRef(el);
                              // Apply lastElementRef to the last element for infinite scroll
                              if (k === data.length - 1 && lastElementRef) {
                                lastElementRef(el);
                              }
                            }}
                            {...provided.draggableProps}
                            className={snapshot.isDragging ? 'dragging-row' : ''}
                            style={{
                              ...provided.draggableProps.style,
                              backgroundColor: snapshot.isDragging ? '#f5f5f5' : 'inherit',
                              boxShadow: snapshot.isDragging ? '0 5px 15px rgba(0,0,0,0.3)' : 'none',
                              transform: snapshot.isDragging 
                                ? `${provided.draggableProps.style?.transform} rotate(1deg)`
                                : provided.draggableProps.style?.transform
                            }}
                          >
                            {mapData.map((res, colIndex) => (
                              <td 
                                key={res?.body}
                                {...(colIndex === 0 ? provided.dragHandleProps : {})}
                              >
                                {res?.Cell ? (
                                  <res.Cell row={i} index={k} />
                                ) : (
                                  <span className={res?.class}>{i[res?.body]}</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        )}
                      </Draggable>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={16}
                      className="text-center"
                      style={{ borderBottom: "none" , padding : "20px" }}
                    >
                      No Data Found !
                    </td>
                  </tr>
                )
              ) : (
                currentPageData?.length > 0 ? (
                  <>
                    {currentPageData.map((i, k) => (
                      <tr key={k}>
                        {mapData.map((res) => (
                          <td key={res?.body}>
                            {res?.Cell ? (
                              <res.Cell row={i} index={k} />
                            ) : (
                              <span className={res?.class}>{i[res?.body]}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan={16}
                      className="text-center"
                      style={{ borderBottom: "none" , padding : "20px" }}
                    >
                      No Data Found !
                    </td>
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
}
