import { useState } from "react";
import TablePagination from "react-js-pagination";

export default function Pagination(props) {
  const { type, setPage, userTotal, rowsPerPage, activePage } = props;

  const [clientData, setClientData] = useState();

  const handlePage = (pageNumber) => {
    setPage(pageNumber);
  };

  const totalPages = Math.ceil(userTotal / rowsPerPage);

  return (
    <>
      {userTotal > 0 && (
        <div className=" row gx-0 custom-pagination m-0 w-100 px-3">
          <>
            <div className="col-12 pagination d-flex flex-column mt-3 mb-3">
              {type === "server" && userTotal > 0 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <p
                      style={{
                        marginBottom: "0px",
                        color: "1F1F1F",
                        fontSize: "15px",
                        fontWeight: "500",
                      }}
                    >
                      Showing {activePage} out of {totalPages} pages
                    </p>
                    <div>
                      <TablePagination
                        activePage={activePage}
                        itemsCountPerPage={rowsPerPage}
                        totalItemsCount={userTotal}
                        pageRangeDisplayed={3}
                        onChange={(page) => handlePage(page)}
                        itemClass="page-item"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="w-100">
                {type === "client" && userTotal > 0 && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <p
                        style={{
                          marginBottom: "0px",
                          color: "1F1F1F",
                          fontSize: "16px",
                          fontWeight: "500",
                        }}
                      >
                        Showing {activePage} out of {totalPages} pages
                      </p>
                      <div>
                        <TablePagination
                          activePage={activePage}
                          itemsCountPerPage={rowsPerPage}
                          totalItemsCount={userTotal}
                          pageRangeDisplayed={3}
                          onChange={handlePage}
                          itemClass="page-item"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
}
