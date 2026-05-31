namespace CarServiceAPI.Models
{
    public class Car
    {
        public Guid Id { get; set; }
        public Guid? MakeId { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string Type { get; set; }
        public string Engine { get; set; }
        public string LicencePlate { get; set; }
        public int FirstRegistration { get; set; }
    }
}
