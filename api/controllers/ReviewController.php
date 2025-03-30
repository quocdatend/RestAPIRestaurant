<?php
require_once __DIR__ . '/../objects/Review.php';

class ReviewController {
    private $db;
    private $review;

    public function __construct($db) {
        $this->db = $db;
        $this->review = new Review($db);
    }

    // Create new review
    public function create() {
        try {
            // Get posted data
            $data = json_decode(file_get_contents("php://input"));

            // Validate input
            if(
                !empty($data->customerName) &&
                !empty($data->rating) &&
                !empty($data->title) &&
                !empty($data->content)
            ) {
                // Validate rating range
                if($data->rating < 1 || $data->rating > 5) {
                    http_response_code(400);
                    echo json_encode(array(
                        "status" => "error",
                        "message" => "Rating must be between 1 and 5"
                    ));
                    return;
                }

                // Set review property values
                $this->review->customerName = $data->customerName;
                $this->review->rating = $data->rating;
                $this->review->title = $data->title;
                $this->review->content = $data->content;

                // Create the review
                if($this->review->create()) {
                    http_response_code(201);
                    echo json_encode(array(
                        "status" => "success",
                        "message" => "Review was created successfully"
                    ));
                } else {
                    http_response_code(503);
                    echo json_encode(array(
                        "status" => "error",
                        "message" => "Unable to create review"
                    ));
                }
            } else {
                http_response_code(400);
                echo json_encode(array(
                    "status" => "error",
                    "message" => "Unable to create review. Data is incomplete."
                ));
            }
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                "status" => "error",
                "message" => "Internal server error"
            ));
        }
    }

    // Read all reviews
    public function read() {
        try {
            $stmt = $this->review->read();
            
            if($stmt) {
                $num = $stmt->rowCount();

                if($num > 0) {
                    $reviews_arr = array();
                    $reviews_arr["status"] = "success";
                    $reviews_arr["data"] = array();

                    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                        $review = new Review($this->db);
                        $review->id = $row['id'];
                        $review->customerName = $row['customerName'];
                        $review->rating = $row['rating'];
                        $review->title = $row['title'];
                        $review->content = $row['content'];
                        $review->date = $row['date'];

                        array_push($reviews_arr["data"], $review->toArray());
                    }

                    // Get average rating
                    $rating_info = $this->review->getAverageRating();
                    if($rating_info) {
                        $reviews_arr["rating_info"] = array(
                            "average_rating" => $rating_info->average_rating,
                            "total_reviews" => $rating_info->total_reviews
                        );
                    }

                    http_response_code(200);
                    echo json_encode($reviews_arr);
                } else {
                    http_response_code(404);
                    echo json_encode(array(
                        "status" => "error",
                        "message" => "No reviews found."
                    ));
                }
            } else {
                http_response_code(503);
                echo json_encode(array(
                    "status" => "error",
                    "message" => "Unable to fetch reviews."
                ));
            }
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                "status" => "error",
                "message" => "Internal server error"
            ));
        }
    }

    // Read single review
    public function readOne($id) {
        try {
            // Set ID value
            $this->review->id = $id;
            
            // Get review
            $stmt = $this->review->readOne();
            
            if($stmt) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if($row) {
                    // Create response array
                    $response = array(
                        "status" => "success",
                        "data" => array(
                            "id" => $row['id'],
                            "customerName" => $row['customerName'],
                            "rating" => $row['rating'],
                            "title" => $row['title'],
                            "content" => $row['content'],
                            "date" => $row['date']
                        )
                    );

                    http_response_code(200);
                    echo json_encode($response);
                } else {
                    http_response_code(404);
                    echo json_encode(array(
                        "status" => "error",
                        "message" => "Review not found."
                    ));
                }
            } else {
                http_response_code(503);
                echo json_encode(array(
                    "status" => "error",
                    "message" => "Unable to fetch review."
                ));
            }
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                "status" => "error",
                "message" => "Internal server error"
            ));
        }
    }

    // Update review
    public function update() {
        try {
            $data = json_decode(file_get_contents("php://input"));

            if(
                !empty($data->id) &&
                !empty($data->customerName) &&
                !empty($data->rating) &&
                !empty($data->title) &&
                !empty($data->content)
            ) {
                // Validate rating range
                if($data->rating < 1 || $data->rating > 5) {
                    http_response_code(400);
                    echo json_encode(array(
                        "status" => "error",
                        "message" => "Rating must be between 1 and 5"
                    ));
                    return;
                }

                $this->review->id = $data->id;
                $this->review->customerName = $data->customerName;
                $this->review->rating = $data->rating;
                $this->review->title = $data->title;
                $this->review->content = $data->content;

                if($this->review->update()) {
                    http_response_code(200);
                    echo json_encode(array(
                        "status" => "success",
                        "message" => "Review was updated successfully"
                    ));
                } else {
                    http_response_code(503);
                    echo json_encode(array(
                        "status" => "error",
                        "message" => "Unable to update review"
                    ));
                }
            } else {
                http_response_code(400);
                echo json_encode(array(
                    "status" => "error",
                    "message" => "Unable to update review. Data is incomplete."
                ));
            }
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                "status" => "error",
                "message" => "Internal server error"
            ));
        }
    }

    // Delete review
    public function delete() {
        try {
            $data = json_decode(file_get_contents("php://input"));

            if(!empty($data->id)) {
                $this->review->id = $data->id;

                if($this->review->delete()) {
                    http_response_code(200);
                    echo json_encode(array(
                        "status" => "success",
                        "message" => "Review was deleted successfully"
                    ));
                } else {
                    http_response_code(503);
                    echo json_encode(array(
                        "status" => "error",
                        "message" => "Unable to delete review"
                    ));
                }
            } else {
                http_response_code(400);
                echo json_encode(array(
                    "status" => "error",
                    "message" => "Unable to delete review. ID is required."
                ));
            }
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode(array(
                "status" => "error",
                "message" => "Internal server error"
            ));
        }
    }
}
?> 