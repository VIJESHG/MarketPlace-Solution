pragma solidity >=0.4.22 <0.6.0;
contract MarketplaceSolution{
    struct Person{
      string name;
      string digital_signature_hash;
    }
    struct Cattle{
        string health_certificate_hash;
        string digital_signature_hash;
        mapping(string => CattleActivities[]) activities_log;
    }
    struct CattleActivities{
        uint timestamp;
        string activity_description_hash;
    }
    struct PaymentBill{
        int bill_id;
        uint timestamp;
        string bill_hash;
    }


}
