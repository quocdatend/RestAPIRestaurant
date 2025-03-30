<?php
class Review {
    private $conn;
    private $table_name = "reviews";

    // Object properties
    public $id;
    public $customerName;
    public $rating;
    public $title;
    public $content;
    public $date;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Create review
    public function create() {
        try {
            $query = "INSERT INTO " . $this->table_name . "
                    SET
                        customerName = :customerName,
                        rating = :rating,
                        title = :title,
                        content = :content,
                        date = NOW()";

            $stmt = $this->conn->prepare($query);

            // Sanitize input
            $this->customerName = htmlspecialchars(strip_tags($this->customerName));
            $this->rating = htmlspecialchars(strip_tags($this->rating));
            $this->title = htmlspecialchars(strip_tags($this->title));
            $this->content = htmlspecialchars(strip_tags($this->content));

            // Bind values
            $stmt->bindParam(":customerName", $this->customerName);
            $stmt->bindParam(":rating", $this->rating);
            $stmt->bindParam(":title", $this->title);
            $stmt->bindParam(":content", $this->content);

            if($stmt->execute()) {
                return true;
            }
            return false;
        } catch(PDOException $e) {
            return false;
        }
    }

    // Read all reviews
    public function read() {
        try {
            $query = "SELECT * FROM " . $this->table_name . " ORDER BY date DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            return $stmt;
        } catch(PDOException $e) {
            return false;
        }
    }

    // Read single review
    public function readOne() {
        try {
            $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->id);
            $stmt->execute();
            return $stmt;
        } catch(PDOException $e) {
            return false;
        }
    }

    // Update review
    public function update() {
        try {
            $query = "UPDATE " . $this->table_name . "
                    SET
                        customerName = :customerName,
                        rating = :rating,
                        title = :title,
                        content = :content
                    WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            // Sanitize input
            $this->customerName = htmlspecialchars(strip_tags($this->customerName));
            $this->rating = htmlspecialchars(strip_tags($this->rating));
            $this->title = htmlspecialchars(strip_tags($this->title));
            $this->content = htmlspecialchars(strip_tags($this->content));
            $this->id = htmlspecialchars(strip_tags($this->id));

            // Bind values
            $stmt->bindParam(":customerName", $this->customerName);
            $stmt->bindParam(":rating", $this->rating);
            $stmt->bindParam(":title", $this->title);
            $stmt->bindParam(":content", $this->content);
            $stmt->bindParam(":id", $this->id);

            if($stmt->execute()) {
                return true;
            }
            return false;
        } catch(PDOException $e) {
            return false;
        }
    }

    // Delete review
    public function delete() {
        try {
            $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(1, $this->id);

            if($stmt->execute()) {
                return true;
            }
            return false;
        } catch(PDOException $e) {
            return false;
        }
    }

    // Get average rating
    public function getAverageRating() {
        try {
            $query = "SELECT AVG(rating) as average_rating, COUNT(*) as total_reviews 
                    FROM " . $this->table_name;

            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if($row) {
                $this->average_rating = $row['average_rating'];
                $this->total_reviews = $row['total_reviews'];
                return $this;
            }
            return false;
        } catch(PDOException $e) {
            return false;
        }
    }

    // Convert to array
    public function toArray() {
        return array(
            "id" => $this->id,
            "customerName" => $this->customerName,
            "rating" => $this->rating,
            "title" => $this->title,
            "content" => $this->content,
            "date" => $this->date
        );
    }
}
?> 