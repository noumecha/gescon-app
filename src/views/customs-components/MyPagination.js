import React from 'react';
import { CardFooter,Pagination,PaginationItem,PaginationLink,Row,} from 'reactstrap';

const MyPagination = ({ pageCount, pageNumber, handlePageChange, handlePagePrev, handlePageNext }) => {
    return (
        <Row className="m-0 justify-content-center">
            <CardFooter className="py-3 d-flex" >
                <nav className="ligna-items-center" aria-label="...">
                    <Pagination
                      className="pagination justify-content-center"
                      listClassName="justify-content-center"
                    >
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePagePrev()}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Previous</span>
                        </PaginationLink>
                      </PaginationItem>
                        {Array.from({length: pageCount}, (_, i) => (
                            <PaginationItem key={i} active={i === pageNumber}>
                                <PaginationLink onClick={() => handlePageChange({selected: i})}>
                                    {i}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageNext()}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Next</span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                </nav>
            </CardFooter>
        </Row>
    );
};

export default MyPagination;