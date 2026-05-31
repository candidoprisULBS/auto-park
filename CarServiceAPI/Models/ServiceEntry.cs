namespace CarServiceAPI.Models
{
    public class ServiceEntry
    {
        public Guid Id { get; set; }
        public Guid CarId { get; set; }
        public Guid DriverId { get; set; }
        public int Mileage { get; set; }
        public string AccidentDetails { get; set; }
    }
}
