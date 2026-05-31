namespace CarServiceAPI.Models
{
    public class DriverAlert
    {
        public Guid Id { get; set; }
        public Guid DriverId { get; set; }
        public Guid TypeId { get; set; }
        public DateTime Expiration { get; set; }
    }
}
